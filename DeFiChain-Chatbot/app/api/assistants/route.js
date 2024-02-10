import OpenAI from 'openai';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

export const POST = async (req) => {
	const { prompt, address } = await req.json();
	console.log(`Prompt: ${prompt}; Address: ${address}`);
 
  try {
		const thread = await openai.beta.threads.create();

		const message = await openai.beta.threads.messages.create(
			thread.id,
			{
				role: "user",
				content: prompt
			}
		);

		let run = await openai.beta.threads.runs.create(
			thread.id,
			{ assistant_id: "asst_LXW9BbKLVXi6stlg4YTT9Bnb" }
		);

		while (run.status == 'queued' || run.status == 'in_progress') {
			console.log(`Run ${run.id} status: ${run.status}`);
			await new Promise(resolve => setTimeout(resolve, 1000));
			run = await openai.beta.threads.runs.retrieve(thread.id, run.id);
		}

		if (run.status == 'completed') {
			const messages = await openai.beta.threads.messages.list(thread.id);
			messages.data.forEach((msg, index) => {
				console.log(`Message ${index + 1}: ${JSON.stringify(msg.content, null, 2)}`);
			});
			return new Response(JSON.stringify({ message: messages.data[0].content[0].text.value }), {
				status: 200,
			});

		} else if (run.status == 'requires_action') {
			console.log(`Function name: ${run.required_action.submit_tool_outputs.tool_calls[0].function.name}`);
			console.log(`Function arguments: ${run.required_action.submit_tool_outputs.tool_calls[0].function.arguments}`);
			return new Response(
				JSON.stringify({
					function: run.required_action.submit_tool_outputs.tool_calls[0].function.name,
					arguments: run.required_action.submit_tool_outputs.tool_calls[0].function.arguments
				}),
				{ status: 200 }
			);	

		} else if (run.status == 'failed') {
			console.log(`Run failed with error: ${run.last_error} at ${run.failed_at}`);
			return new Response(JSON.stringify({ error: `${run.last_error} and failed at: ${run.failed_at}` }), {
				status: 500,
			});

		} else {
			console.log(`Run status is something weird: ${run.status}`);
			return new Response(JSON.stringify({ weird_status: run.status }), {
				status: 500,
			});
		}

  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
};
