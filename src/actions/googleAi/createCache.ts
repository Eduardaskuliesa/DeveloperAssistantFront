import googleAi from "@/src/services/google-ai";

export async function createCache() {
  const systemInstruction = {
    parts: [
      {
        text: "You are a helpful and concise assistant. Always answer directly and avoid lengthy explanations unless specifically asked. Do not make assumptions. Prioritize clarity and brevity.",
      },
    ],
  };

  const cache = await googleAi.caches.create({
    model: "gemini-2.0-flash",
    config: {
      ttl: `${3600}s`,
      contents: LONG_TEXT,
      systemInstruction,
    },
  });

  console.log("Cache created:", cache);

  return {
    success: true,
    cache,
  };
}

const LONG_TEXT = `Getting started with long context
Earlier versions of generative models were only able to process 8,000 tokens at a time. Newer models pushed this further by accepting 32,000 or even 128,000 tokens. Gemini is the first model capable of accepting 1 million tokens.

In practice, 1 million tokens would look like:

50,000 lines of code (with the standard 80 characters per line)
All the text messages you have sent in the last 5 years
8 average length English novels
Transcripts of over 200 average length podcast episodes
The more limited context windows common in many other models often require strategies like arbitrarily dropping old messages, summarizing content, using RAG with vector databases, or filtering prompts to save tokens.

While these techniques remain valuable in specific scenarios, Gemini's extensive context window invites a more direct approach: providing all relevant information upfront. Because Gemini models were purpose-built with massive context capabilities, they demonstrate powerful in-context learning. For example, using only in-context instructional materials (a 500-page reference grammar, a dictionary, and ≈400 parallel sentences), Gemini learned to translate from English to Kalamang—a Papuan language with fewer than 200 speakers—with quality similar to a human learner using the same materials. This illustrates the paradigm shift enabled by Gemini's long context, empowering new possibilities through robust in-context learning.

Long context use cases
While the standard use case for most generative models is still text input, the Gemini model family enables a new paradigm of multimodal use cases. These models can natively understand text, video, audio, and images. They are accompanied by the Gemini API that takes in multimodal file types for convenience.

Long form text
Text has proved to be the layer of intelligence underpinning much of the momentum around LLMs. As mentioned earlier, much of the practical limitation of LLMs was because of not having a large enough context window to do certain tasks. This led to the rapid adoption of retrieval augmented generation (RAG) and other techniques which dynamically provide the model with relevant contextual information. Now, with larger and larger context windows, there are new techniques becoming available which unlock new use cases.

Some emerging and standard use cases for text based long context include:

Summarizing large corpuses of text
Previous summarization options with smaller context models would require a sliding window or another technique to keep state of previous sections as new tokens are passed to the model
Question and answering
Historically this was only possible with RAG given the limited amount of context and models' factual recall being low
Agentic workflows
Text is the underpinning of how agents keep state of what they have done and what they need to do; not having enough information about the world and the agent's goal is a limitation on the reliability of agents
Many-shot in-context learning is one of the most unique capabilities unlocked by long context models. Research has shown that taking the common "single shot" or "multi-shot" example paradigm, where the model is presented with one or a few examples of a task, and scaling that up to hundreds, thousands, or even hundreds of thousands of examples, can lead to novel model capabilities. This many-shot approach has also been shown to perform similarly to models which were fine-tuned for a specific task. For use cases where a Gemini model's performance is not yet sufficient for a production rollout, you can try the many-shot approach. As you might explore later in the long context optimization section, context caching makes this type of high input token workload much more economically feasible and even lower latency in some cases.

Long form video
Video content's utility has long been constrained by the lack of accessibility of the medium itself. It was hard to skim the content, transcripts often failed to capture the nuance of a video, and most tools don't process image, text, and audio together. With Gemini, the long-context text capabilities translate to the ability to reason and answer questions about multimodal inputs with sustained performance.

Some emerging and standard use cases for video long context include:

Video question and answering
Video memory, as shown with Google's Project Astra
Video captioning
Video recommendation systems, by enriching existing metadata with new multimodal understanding
Video customization, by looking at a corpus of data and associated video metadata and then removing parts of videos that are not relevant to the viewer
Video content moderation
Real-time video processing
When working with videos, it is important to consider how the videos are processed into tokens, which affects billing and usage limits. You can learn more about prompting with video files in the Prompting guide.

Long form audio
The Gemini models were the first natively multimodal large language models that could understand audio. Historically, the typical developer workflow would involve stringing together multiple domain specific models, like a speech-to-text model and a text-to-text model, in order to process audio. This led to additional latency required by performing multiple round-trip requests and decreased performance usually attributed to disconnected architectures of the multiple model setup.

Some emerging and standard use cases for audio context include:

Real-time transcription and translation
Podcast / video question and answering
Meeting transcription and summarization
Voice assistants
You can learn more about prompting with audio files in the Prompting guide.

Long context optimizations
The primary optimization when working with long context and the Gemini models is to use context caching. Beyond the previous impossibility of processing lots of tokens in a single request, the other main constraint was the cost. If you have a "chat with your data" app where a user uploads 10 PDFs, a video, and some work documents, you would historically have to work with a more complex retrieval augmented generation (RAG) tool / framework in order to process these requests and pay a significant amount for tokens moved into the context window. Now, you can cache the files the user uploads and pay to store them on a per hour basis. The input / output cost per request with Gemini Flash for example is ~4x less than the standard input / output cost, so if the user chats with their data enough, it becomes a huge cost saving for you as the developer.

Long context limitations
In various sections of this guide, we talked about how Gemini models achieve high performance across various needle-in-a-haystack retrieval evals. These tests consider the most basic setup, where you have a single needle you are looking for. In cases where you might have multiple "needles" or specific pieces of information you are looking for, the model does not perform with the same accuracy. Performance can vary to a wide degree depending on the context. This is important to consider as there is an inherent tradeoff between getting the right information retrieved and cost. You can get ~99% on a single query, but you have to pay the input token cost every time you send that query. So for 100 pieces of information to be retrieved, if you needed 99% performance, you would likely need to send 100 requests. This is a good example of where context caching can significantly reduce the cost associated with using Gemini models while keeping the performance high.

FAQs
Where is the best place to put my query in the context window?
In most cases, especially if the total context is long, the model's performance will be better if you put your query / question at the end of the prompt (after all the other context).

Do I lose model performance when I add more tokens to a query?
Generally, if you don't need tokens to be passed to the model, it is best to avoid passing them. However, if you have a large chunk of tokens with some information and want to ask questions about that information, the model is highly capable of extracting that information (up to 99% accuracy in many cases).

How can I lower my cost with long-context queries?
If you have a similar set of tokens / context that you want to re-use many times, context caching can help reduce the costs associated with asking questions about that information.

Does the context length affect the model latency?
There is some fixed amount of latency in any given request, regardless of the size, but generally longer queries will have higher latency (time to first token).
Getting started with long context
Earlier versions of generative models were only able to process 8,000 tokens at a time. Newer models pushed this further by accepting 32,000 or even 128,000 tokens. Gemini is the first model capable of accepting 1 million tokens.

In practice, 1 million tokens would look like:

50,000 lines of code (with the standard 80 characters per line)
All the text messages you have sent in the last 5 years
8 average length English novels
Transcripts of over 200 average length podcast episodes
The more limited context windows common in many other models often require strategies like arbitrarily dropping old messages, summarizing content, using RAG with vector databases, or filtering prompts to save tokens.

While these techniques remain valuable in specific scenarios, Gemini's extensive context window invites a more direct approach: providing all relevant information upfront. Because Gemini models were purpose-built with massive context capabilities, they demonstrate powerful in-context learning. For example, using only in-context instructional materials (a 500-page reference grammar, a dictionary, and ≈400 parallel sentences), Gemini learned to translate from English to Kalamang—a Papuan language with fewer than 200 speakers—with quality similar to a human learner using the same materials. This illustrates the paradigm shift enabled by Gemini's long context, empowering new possibilities through robust in-context learning.

Long context use cases
While the standard use case for most generative models is still text input, the Gemini model family enables a new paradigm of multimodal use cases. These models can natively understand text, video, audio, and images. They are accompanied by the Gemini API that takes in multimodal file types for convenience.

Long form text
Text has proved to be the layer of intelligence underpinning much of the momentum around LLMs. As mentioned earlier, much of the practical limitation of LLMs was because of not having a large enough context window to do certain tasks. This led to the rapid adoption of retrieval augmented generation (RAG) and other techniques which dynamically provide the model with relevant contextual information. Now, with larger and larger context windows, there are new techniques becoming available which unlock new use cases.

Some emerging and standard use cases for text based long context include:

Summarizing large corpuses of text
Previous summarization options with smaller context models would require a sliding window or another technique to keep state of previous sections as new tokens are passed to the model
Question and answering
Historically this was only possible with RAG given the limited amount of context and models' factual recall being low
Agentic workflows
Text is the underpinning of how agents keep state of what they have done and what they need to do; not having enough information about the world and the agent's goal is a limitation on the reliability of agents
Many-shot in-context learning is one of the most unique capabilities unlocked by long context models. Research has shown that taking the common "single shot" or "multi-shot" example paradigm, where the model is presented with one or a few examples of a task, and scaling that up to hundreds, thousands, or even hundreds of thousands of examples, can lead to novel model capabilities. This many-shot approach has also been shown to perform similarly to models which were fine-tuned for a specific task. For use cases where a Gemini model's performance is not yet sufficient for a production rollout, you can try the many-shot approach. As you might explore later in the long context optimization section, context caching makes this type of high input token workload much more economically feasible and even lower latency in some cases.

Long form video
Video content's utility has long been constrained by the lack of accessibility of the medium itself. It was hard to skim the content, transcripts often failed to capture the nuance of a video, and most tools don't process image, text, and audio together. With Gemini, the long-context text capabilities translate to the ability to reason and answer questions about multimodal inputs with sustained performance.

Some emerging and standard use cases for video long context include:

Video question and answering
Video memory, as shown with Google's Project Astra
Video captioning
Video recommendation systems, by enriching existing metadata with new multimodal understanding
Video customization, by looking at a corpus of data and associated video metadata and then removing parts of videos that are not relevant to the viewer
Video content moderation
Real-time video processing
When working with videos, it is important to consider how the videos are processed into tokens, which affects billing and usage limits. You can learn more about prompting with video files in the Prompting guide.

Long form audio
The Gemini models were the first natively multimodal large language models that could understand audio. Historically, the typical developer workflow would involve stringing together multiple domain specific models, like a speech-to-text model and a text-to-text model, in order to process audio. This led to additional latency required by performing multiple round-trip requests and decreased performance usually attributed to disconnected architectures of the multiple model setup.

Some emerging and standard use cases for audio context include:

Real-time transcription and translation
Podcast / video question and answering
Meeting transcription and summarization
Voice assistants
You can learn more about prompting with audio files in the Prompting guide.

Long context optimizations
The primary optimization when working with long context and the Gemini models is to use context caching. Beyond the previous impossibility of processing lots of tokens in a single request, the other main constraint was the cost. If you have a "chat with your data" app where a user uploads 10 PDFs, a video, and some work documents, you would historically have to work with a more complex retrieval augmented generation (RAG) tool / framework in order to process these requests and pay a significant amount for tokens moved into the context window. Now, you can cache the files the user uploads and pay to store them on a per hour basis. The input / output cost per request with Gemini Flash for example is ~4x less than the standard input / output cost, so if the user chats with their data enough, it becomes a huge cost saving for you as the developer.

Long context limitations
In various sections of this guide, we talked about how Gemini models achieve high performance across various needle-in-a-haystack retrieval evals. These tests consider the most basic setup, where you have a single needle you are looking for. In cases where you might have multiple "needles" or specific pieces of information you are looking for, the model does not perform with the same accuracy. Performance can vary to a wide degree depending on the context. This is important to consider as there is an inherent tradeoff between getting the right information retrieved and cost. You can get ~99% on a single query, but you have to pay the input token cost every time you send that query. So for 100 pieces of information to be retrieved, if you needed 99% performance, you would likely need to send 100 requests. This is a good example of where context caching can significantly reduce the cost associated with using Gemini models while keeping the performance high.

FAQs
Where is the best place to put my query in the context window?
In most cases, especially if the total context is long, the model's performance will be better if you put your query / question at the end of the prompt (after all the other context).

Do I lose model performance when I add more tokens to a query?
Generally, if you don't need tokens to be passed to the model, it is best to avoid passing them. However, if you have a large chunk of tokens with some information and want to ask questions about that information, the model is highly capable of extracting that information (up to 99% accuracy in many cases).

How can I lower my cost with long-context queries?
If you have a similar set of tokens / context that you want to re-use many times, context caching can help reduce the costs associated with asking questions about that information.

Does the context length affect the model latency?
There is some fixed amount of latency in any given request, regardless of the size, but generally longer queries will have higher latency (time to first token).
Getting started with long context
Earlier versions of generative models were only able to process 8,000 tokens at a time. Newer models pushed this further by accepting 32,000 or even 128,000 tokens. Gemini is the first model capable of accepting 1 million tokens.

In practice, 1 million tokens would look like:

50,000 lines of code (with the standard 80 characters per line)
All the text messages you have sent in the last 5 years
8 average length English novels
Transcripts of over 200 average length podcast episodes
The more limited context windows common in many other models often require strategies like arbitrarily dropping old messages, summarizing content, using RAG with vector databases, or filtering prompts to save tokens.

While these techniques remain valuable in specific scenarios, Gemini's extensive context window invites a more direct approach: providing all relevant information upfront. Because Gemini models were purpose-built with massive context capabilities, they demonstrate powerful in-context learning. For example, using only in-context instructional materials (a 500-page reference grammar, a dictionary, and ≈400 parallel sentences), Gemini learned to translate from English to Kalamang—a Papuan language with fewer than 200 speakers—with quality similar to a human learner using the same materials. This illustrates the paradigm shift enabled by Gemini's long context, empowering new possibilities through robust in-context learning.

Long context use cases
While the standard use case for most generative models is still text input, the Gemini model family enables a new paradigm of multimodal use cases. These models can natively understand text, video, audio, and images. They are accompanied by the Gemini API that takes in multimodal file types for convenience.

Long form text
Text has proved to be the layer of intelligence underpinning much of the momentum around LLMs. As mentioned earlier, much of the practical limitation of LLMs was because of not having a large enough context window to do certain tasks. This led to the rapid adoption of retrieval augmented generation (RAG) and other techniques which dynamically provide the model with relevant contextual information. Now, with larger and larger context windows, there are new techniques becoming available which unlock new use cases.

Some emerging and standard use cases for text based long context include:

Summarizing large corpuses of text
Previous summarization options with smaller context models would require a sliding window or another technique to keep state of previous sections as new tokens are passed to the model
Question and answering
Historically this was only possible with RAG given the limited amount of context and models' factual recall being low
Agentic workflows
Text is the underpinning of how agents keep state of what they have done and what they need to do; not having enough information about the world and the agent's goal is a limitation on the reliability of agents
Many-shot in-context learning is one of the most unique capabilities unlocked by long context models. Research has shown that taking the common "single shot" or "multi-shot" example paradigm, where the model is presented with one or a few examples of a task, and scaling that up to hundreds, thousands, or even hundreds of thousands of examples, can lead to novel model capabilities. This many-shot approach has also been shown to perform similarly to models which were fine-tuned for a specific task. For use cases where a Gemini model's performance is not yet sufficient for a production rollout, you can try the many-shot approach. As you might explore later in the long context optimization section, context caching makes this type of high input token workload much more economically feasible and even lower latency in some cases.

Long form video
Video content's utility has long been constrained by the lack of accessibility of the medium itself. It was hard to skim the content, transcripts often failed to capture the nuance of a video, and most tools don't process image, text, and audio together. With Gemini, the long-context text capabilities translate to the ability to reason and answer questions about multimodal inputs with sustained performance.

Some emerging and standard use cases for video long context include:

Video question and answering
Video memory, as shown with Google's Project Astra
Video captioning
Video recommendation systems, by enriching existing metadata with new multimodal understanding
Video customization, by looking at a corpus of data and associated video metadata and then removing parts of videos that are not relevant to the viewer
Video content moderation
Real-time video processing
When working with videos, it is important to consider how the videos are processed into tokens, which affects billing and usage limits. You can learn more about prompting with video files in the Prompting guide.

Long form audio
The Gemini models were the first natively multimodal large language models that could understand audio. Historically, the typical developer workflow would involve stringing together multiple domain specific models, like a speech-to-text model and a text-to-text model, in order to process audio. This led to additional latency required by performing multiple round-trip requests and decreased performance usually attributed to disconnected architectures of the multiple model setup.

Some emerging and standard use cases for audio context include:

Real-time transcription and translation
Podcast / video question and answering
Meeting transcription and summarization
Voice assistants
You can learn more about prompting with audio files in the Prompting guide.

Long context optimizations
The primary optimization when working with long context and the Gemini models is to use context caching. Beyond the previous impossibility of processing lots of tokens in a single request, the other main constraint was the cost. If you have a "chat with your data" app where a user uploads 10 PDFs, a video, and some work documents, you would historically have to work with a more complex retrieval augmented generation (RAG) tool / framework in order to process these requests and pay a significant amount for tokens moved into the context window. Now, you can cache the files the user uploads and pay to store them on a per hour basis. The input / output cost per request with Gemini Flash for example is ~4x less than the standard input / output cost, so if the user chats with their data enough, it becomes a huge cost saving for you as the developer.

Long context limitations
In various sections of this guide, we talked about how Gemini models achieve high performance across various needle-in-a-haystack retrieval evals. These tests consider the most basic setup, where you have a single needle you are looking for. In cases where you might have multiple "needles" or specific pieces of information you are looking for, the model does not perform with the same accuracy. Performance can vary to a wide degree depending on the context. This is important to consider as there is an inherent tradeoff between getting the right information retrieved and cost. You can get ~99% on a single query, but you have to pay the input token cost every time you send that query. So for 100 pieces of information to be retrieved, if you needed 99% performance, you would likely need to send 100 requests. This is a good example of where context caching can significantly reduce the cost associated with using Gemini models while keeping the performance high.

FAQs
Where is the best place to put my query in the context window?
In most cases, especially if the total context is long, the model's performance will be better if you put your query / question at the end of the prompt (after all the other context).

Do I lose model performance when I add more tokens to a query?
Generally, if you don't need tokens to be passed to the model, it is best to avoid passing them. However, if you have a large chunk of tokens with some information and want to ask questions about that information, the model is highly capable of extracting that information (up to 99% accuracy in many cases).

How can I lower my cost with long-context queries?
If you have a similar set of tokens / context that you want to re-use many times, context caching can help reduce the costs associated with asking questions about that information.

Does the context length affect the model latency?
There is some fixed amount of latency in any given request, regardless of the size, but generally longer queries will have higher latency (time to first token).
Getting started with long context
Earlier versions of generative models were only able to process 8,000 tokens at a time. Newer models pushed this further by accepting 32,000 or even 128,000 tokens. Gemini is the first model capable of accepting 1 million tokens.

In practice, 1 million tokens would look like:

50,000 lines of code (with the standard 80 characters per line)
All the text messages you have sent in the last 5 years
8 average length English novels
Transcripts of over 200 average length podcast episodes
The more limited context windows common in many other models often require strategies like arbitrarily dropping old messages, summarizing content, using RAG with vector databases, or filtering prompts to save tokens.

While these techniques remain valuable in specific scenarios, Gemini's extensive context window invites a more direct approach: providing all relevant information upfront. Because Gemini models were purpose-built with massive context capabilities, they demonstrate powerful in-context learning. For example, using only in-context instructional materials (a 500-page reference grammar, a dictionary, and ≈400 parallel sentences), Gemini learned to translate from English to Kalamang—a Papuan language with fewer than 200 speakers—with quality similar to a human learner using the same materials. This illustrates the paradigm shift enabled by Gemini's long context, empowering new possibilities through robust in-context learning.

Long context use cases
While the standard use case for most generative models is still text input, the Gemini model family enables a new paradigm of multimodal use cases. These models can natively understand text, video, audio, and images. They are accompanied by the Gemini API that takes in multimodal file types for convenience.

Long form text
Text has proved to be the layer of intelligence underpinning much of the momentum around LLMs. As mentioned earlier, much of the practical limitation of LLMs was because of not having a large enough context window to do certain tasks. This led to the rapid adoption of retrieval augmented generation (RAG) and other techniques which dynamically provide the model with relevant contextual information. Now, with larger and larger context windows, there are new techniques becoming available which unlock new use cases.

Some emerging and standard use cases for text based long context include:

Summarizing large corpuses of text
Previous summarization options with smaller context models would require a sliding window or another technique to keep state of previous sections as new tokens are passed to the model
Question and answering
Historically this was only possible with RAG given the limited amount of context and models' factual recall being low
Agentic workflows
Text is the underpinning of how agents keep state of what they have done and what they need to do; not having enough information about the world and the agent's goal is a limitation on the reliability of agents
Many-shot in-context learning is one of the most unique capabilities unlocked by long context models. Research has shown that taking the common "single shot" or "multi-shot" example paradigm, where the model is presented with one or a few examples of a task, and scaling that up to hundreds, thousands, or even hundreds of thousands of examples, can lead to novel model capabilities. This many-shot approach has also been shown to perform similarly to models which were fine-tuned for a specific task. For use cases where a Gemini model's performance is not yet sufficient for a production rollout, you can try the many-shot approach. As you might explore later in the long context optimization section, context caching makes this type of high input token workload much more economically feasible and even lower latency in some cases.

Long form video
Video content's utility has long been constrained by the lack of accessibility of the medium itself. It was hard to skim the content, transcripts often failed to capture the nuance of a video, and most tools don't process image, text, and audio together. With Gemini, the long-context text capabilities translate to the ability to reason and answer questions about multimodal inputs with sustained performance.

Some emerging and standard use cases for video long context include:

Video question and answering
Video memory, as shown with Google's Project Astra
Video captioning
Video recommendation systems, by enriching existing metadata with new multimodal understanding
Video customization, by looking at a corpus of data and associated video metadata and then removing parts of videos that are not relevant to the viewer
Video content moderation
Real-time video processing
When working with videos, it is important to consider how the videos are processed into tokens, which affects billing and usage limits. You can learn more about prompting with video files in the Prompting guide.

Long form audio
The Gemini models were the first natively multimodal large language models that could understand audio. Historically, the typical developer workflow would involve stringing together multiple domain specific models, like a speech-to-text model and a text-to-text model, in order to process audio. This led to additional latency required by performing multiple round-trip requests and decreased performance usually attributed to disconnected architectures of the multiple model setup.

Some emerging and standard use cases for audio context include:

Real-time transcription and translation
Podcast / video question and answering
Meeting transcription and summarization
Voice assistants
You can learn more about prompting with audio files in the Prompting guide.

Long context optimizations
The primary optimization when working with long context and the Gemini models is to use context caching. Beyond the previous impossibility of processing lots of tokens in a single request, the other main constraint was the cost. If you have a "chat with your data" app where a user uploads 10 PDFs, a video, and some work documents, you would historically have to work with a more complex retrieval augmented generation (RAG) tool / framework in order to process these requests and pay a significant amount for tokens moved into the context window. Now, you can cache the files the user uploads and pay to store them on a per hour basis. The input / output cost per request with Gemini Flash for example is ~4x less than the standard input / output cost, so if the user chats with their data enough, it becomes a huge cost saving for you as the developer.

Long context limitations
In various sections of this guide, we talked about how Gemini models achieve high performance across various needle-in-a-haystack retrieval evals. These tests consider the most basic setup, where you have a single needle you are looking for. In cases where you might have multiple "needles" or specific pieces of information you are looking for, the model does not perform with the same accuracy. Performance can vary to a wide degree depending on the context. This is important to consider as there is an inherent tradeoff between getting the right information retrieved and cost. You can get ~99% on a single query, but you have to pay the input token cost every time you send that query. So for 100 pieces of information to be retrieved, if you needed 99% performance, you would likely need to send 100 requests. This is a good example of where context caching can significantly reduce the cost associated with using Gemini models while keeping the performance high.

FAQs
Where is the best place to put my query in the context window?
In most cases, especially if the total context is long, the model's performance will be better if you put your query / question at the end of the prompt (after all the other context).

Do I lose model performance when I add more tokens to a query?
Generally, if you don't need tokens to be passed to the model, it is best to avoid passing them. However, if you have a large chunk of tokens with some information and want to ask questions about that information, the model is highly capable of extracting that information (up to 99% accuracy in many cases).

How can I lower my cost with long-context queries?
If you have a similar set of tokens / context that you want to re-use many times, context caching can help reduce the costs associated with asking questions about that information.

Does the context length affect the model latency?
There is some fixed amount of latency in any given request, regardless of the size, but generally longer queries will have higher latency (time to first token).
Getting started with long context
Earlier versions of generative models were only able to process 8,000 tokens at a time. Newer models pushed this further by accepting 32,000 or even 128,000 tokens. Gemini is the first model capable of accepting 1 million tokens.

In practice, 1 million tokens would look like:

50,000 lines of code (with the standard 80 characters per line)
All the text messages you have sent in the last 5 years
8 average length English novels
Transcripts of over 200 average length podcast episodes
The more limited context windows common in many other models often require strategies like arbitrarily dropping old messages, summarizing content, using RAG with vector databases, or filtering prompts to save tokens.

While these techniques remain valuable in specific scenarios, Gemini's extensive context window invites a more direct approach: providing all relevant information upfront. Because Gemini models were purpose-built with massive context capabilities, they demonstrate powerful in-context learning. For example, using only in-context instructional materials (a 500-page reference grammar, a dictionary, and ≈400 parallel sentences), Gemini learned to translate from English to Kalamang—a Papuan language with fewer than 200 speakers—with quality similar to a human learner using the same materials. This illustrates the paradigm shift enabled by Gemini's long context, empowering new possibilities through robust in-context learning.

Long context use cases
While the standard use case for most generative models is still text input, the Gemini model family enables a new paradigm of multimodal use cases. These models can natively understand text, video, audio, and images. They are accompanied by the Gemini API that takes in multimodal file types for convenience.

Long form text
Text has proved to be the layer of intelligence underpinning much of the momentum around LLMs. As mentioned earlier, much of the practical limitation of LLMs was because of not having a large enough context window to do certain tasks. This led to the rapid adoption of retrieval augmented generation (RAG) and other techniques which dynamically provide the model with relevant contextual information. Now, with larger and larger context windows, there are new techniques becoming available which unlock new use cases.

Some emerging and standard use cases for text based long context include:

Summarizing large corpuses of text
Previous summarization options with smaller context models would require a sliding window or another technique to keep state of previous sections as new tokens are passed to the model
Question and answering
Historically this was only possible with RAG given the limited amount of context and models' factual recall being low
Agentic workflows
Text is the underpinning of how agents keep state of what they have done and what they need to do; not having enough information about the world and the agent's goal is a limitation on the reliability of agents
Many-shot in-context learning is one of the most unique capabilities unlocked by long context models. Research has shown that taking the common "single shot" or "multi-shot" example paradigm, where the model is presented with one or a few examples of a task, and scaling that up to hundreds, thousands, or even hundreds of thousands of examples, can lead to novel model capabilities. This many-shot approach has also been shown to perform similarly to models which were fine-tuned for a specific task. For use cases where a Gemini model's performance is not yet sufficient for a production rollout, you can try the many-shot approach. As you might explore later in the long context optimization section, context caching makes this type of high input token workload much more economically feasible and even lower latency in some cases.

Long form video
Video content's utility has long been constrained by the lack of accessibility of the medium itself. It was hard to skim the content, transcripts often failed to capture the nuance of a video, and most tools don't process image, text, and audio together. With Gemini, the long-context text capabilities translate to the ability to reason and answer questions about multimodal inputs with sustained performance.

Some emerging and standard use cases for video long context include:

Video question and answering
Video memory, as shown with Google's Project Astra
Video captioning
Video recommendation systems, by enriching existing metadata with new multimodal understanding
Video customization, by looking at a corpus of data and associated video metadata and then removing parts of videos that are not relevant to the viewer
Video content moderation
Real-time video processing
When working with videos, it is important to consider how the videos are processed into tokens, which affects billing and usage limits. You can learn more about prompting with video files in the Prompting guide.

Long form audio
The Gemini models were the first natively multimodal large language models that could understand audio. Historically, the typical developer workflow would involve stringing together multiple domain specific models, like a speech-to-text model and a text-to-text model, in order to process audio. This led to additional latency required by performing multiple round-trip requests and decreased performance usually attributed to disconnected architectures of the multiple model setup.

Some emerging and standard use cases for audio context include:

Real-time transcription and translation
Podcast / video question and answering
Meeting transcription and summarization
Voice assistants
You can learn more about prompting with audio files in the Prompting guide.

Long context optimizations
The primary optimization when working with long context and the Gemini models is to use context caching. Beyond the previous impossibility of processing lots of tokens in a single request, the other main constraint was the cost. If you have a "chat with your data" app where a user uploads 10 PDFs, a video, and some work documents, you would historically have to work with a more complex retrieval augmented generation (RAG) tool / framework in order to process these requests and pay a significant amount for tokens moved into the context window. Now, you can cache the files the user uploads and pay to store them on a per hour basis. The input / output cost per request with Gemini Flash for example is ~4x less than the standard input / output cost, so if the user chats with their data enough, it becomes a huge cost saving for you as the developer.

Long context limitations
In various sections of this guide, we talked about how Gemini models achieve high performance across various needle-in-a-haystack retrieval evals. These tests consider the most basic setup, where you have a single needle you are looking for. In cases where you might have multiple "needles" or specific pieces of information you are looking for, the model does not perform with the same accuracy. Performance can vary to a wide degree depending on the context. This is important to consider as there is an inherent tradeoff between getting the right information retrieved and cost. You can get ~99% on a single query, but you have to pay the input token cost every time you send that query. So for 100 pieces of information to be retrieved, if you needed 99% performance, you would likely need to send 100 requests. This is a good example of where context caching can significantly reduce the cost associated with using Gemini models while keeping the performance high.

FAQs
Where is the best place to put my query in the context window?
In most cases, especially if the total context is long, the model's performance will be better if you put your query / question at the end of the prompt (after all the other context).

Do I lose model performance when I add more tokens to a query?
Generally, if you don't need tokens to be passed to the model, it is best to avoid passing them. However, if you have a large chunk of tokens with some information and want to ask questions about that information, the model is highly capable of extracting that information (up to 99% accuracy in many cases).

How can I lower my cost with long-context queries?
If you have a similar set of tokens / context that you want to re-use many times, context caching can help reduce the costs associated with asking questions about that information.

Does the context length affect the model latency?
There is some fixed amount of latency in any given request, regardless of the size, but generally longer queries will have higher latency (time to first token).
Getting started with long context
Earlier versions of generative models were only able to process 8,000 tokens at a time. Newer models pushed this further by accepting 32,000 or even 128,000 tokens. Gemini is the first model capable of accepting 1 million tokens.

In practice, 1 million tokens would look like:

50,000 lines of code (with the standard 80 characters per line)
All the text messages you have sent in the last 5 years
8 average length English novels
Transcripts of over 200 average length podcast episodes
The more limited context windows common in many other models often require strategies like arbitrarily dropping old messages, summarizing content, using RAG with vector databases, or filtering prompts to save tokens.

While these techniques remain valuable in specific scenarios, Gemini's extensive context window invites a more direct approach: providing all relevant information upfront. Because Gemini models were purpose-built with massive context capabilities, they demonstrate powerful in-context learning. For example, using only in-context instructional materials (a 500-page reference grammar, a dictionary, and ≈400 parallel sentences), Gemini learned to translate from English to Kalamang—a Papuan language with fewer than 200 speakers—with quality similar to a human learner using the same materials. This illustrates the paradigm shift enabled by Gemini's long context, empowering new possibilities through robust in-context learning.

Long context use cases
While the standard use case for most generative models is still text input, the Gemini model family enables a new paradigm of multimodal use cases. These models can natively understand text, video, audio, and images. They are accompanied by the Gemini API that takes in multimodal file types for convenience.

Long form text
Text has proved to be the layer of intelligence underpinning much of the momentum around LLMs. As mentioned earlier, much of the practical limitation of LLMs was because of not having a large enough context window to do certain tasks. This led to the rapid adoption of retrieval augmented generation (RAG) and other techniques which dynamically provide the model with relevant contextual information. Now, with larger and larger context windows, there are new techniques becoming available which unlock new use cases.

Some emerging and standard use cases for text based long context include:

Summarizing large corpuses of text
Previous summarization options with smaller context models would require a sliding window or another technique to keep state of previous sections as new tokens are passed to the model
Question and answering
Historically this was only possible with RAG given the limited amount of context and models' factual recall being low
Agentic workflows
Text is the underpinning of how agents keep state of what they have done and what they need to do; not having enough information about the world and the agent's goal is a limitation on the reliability of agents
Many-shot in-context learning is one of the most unique capabilities unlocked by long context models. Research has shown that taking the common "single shot" or "multi-shot" example paradigm, where the model is presented with one or a few examples of a task, and scaling that up to hundreds, thousands, or even hundreds of thousands of examples, can lead to novel model capabilities. This many-shot approach has also been shown to perform similarly to models which were fine-tuned for a specific task. For use cases where a Gemini model's performance is not yet sufficient for a production rollout, you can try the many-shot approach. As you might explore later in the long context optimization section, context caching makes this type of high input token workload much more economically feasible and even lower latency in some cases.

Long form video
Video content's utility has long been constrained by the lack of accessibility of the medium itself. It was hard to skim the content, transcripts often failed to capture the nuance of a video, and most tools don't process image, text, and audio together. With Gemini, the long-context text capabilities translate to the ability to reason and answer questions about multimodal inputs with sustained performance.

Some emerging and standard use cases for video long context include:

Video question and answering
Video memory, as shown with Google's Project Astra
Video captioning
Video recommendation systems, by enriching existing metadata with new multimodal understanding
Video customization, by looking at a corpus of data and associated video metadata and then removing parts of videos that are not relevant to the viewer
Video content moderation
Real-time video processing
When working with videos, it is important to consider how the videos are processed into tokens, which affects billing and usage limits. You can learn more about prompting with video files in the Prompting guide.

Long form audio
The Gemini models were the first natively multimodal large language models that could understand audio. Historically, the typical developer workflow would involve stringing together multiple domain specific models, like a speech-to-text model and a text-to-text model, in order to process audio. This led to additional latency required by performing multiple round-trip requests and decreased performance usually attributed to disconnected architectures of the multiple model setup.

Some emerging and standard use cases for audio context include:

Real-time transcription and translation
Podcast / video question and answering
Meeting transcription and summarization
Voice assistants
You can learn more about prompting with audio files in the Prompting guide.

Long context optimizations
The primary optimization when working with long context and the Gemini models is to use context caching. Beyond the previous impossibility of processing lots of tokens in a single request, the other main constraint was the cost. If you have a "chat with your data" app where a user uploads 10 PDFs, a video, and some work documents, you would historically have to work with a more complex retrieval augmented generation (RAG) tool / framework in order to process these requests and pay a significant amount for tokens moved into the context window. Now, you can cache the files the user uploads and pay to store them on a per hour basis. The input / output cost per request with Gemini Flash for example is ~4x less than the standard input / output cost, so if the user chats with their data enough, it becomes a huge cost saving for you as the developer.

Long context limitations
In various sections of this guide, we talked about how Gemini models achieve high performance across various needle-in-a-haystack retrieval evals. These tests consider the most basic setup, where you have a single needle you are looking for. In cases where you might have multiple "needles" or specific pieces of information you are looking for, the model does not perform with the same accuracy. Performance can vary to a wide degree depending on the context. This is important to consider as there is an inherent tradeoff between getting the right information retrieved and cost. You can get ~99% on a single query, but you have to pay the input token cost every time you send that query. So for 100 pieces of information to be retrieved, if you needed 99% performance, you would likely need to send 100 requests. This is a good example of where context caching can significantly reduce the cost associated with using Gemini models while keeping the performance high.

FAQs
Where is the best place to put my query in the context window?
In most cases, especially if the total context is long, the model's performance will be better if you put your query / question at the end of the prompt (after all the other context).

Do I lose model performance when I add more tokens to a query?
Generally, if you don't need tokens to be passed to the model, it is best to avoid passing them. However, if you have a large chunk of tokens with some information and want to ask questions about that information, the model is highly capable of extracting that information (up to 99% accuracy in many cases).

How can I lower my cost with long-context queries?
If you have a similar set of tokens / context that you want to re-use many times, context caching can help reduce the costs associated with asking questions about that information.

Does the context length affect the model latency?
There is some fixed amount of latency in any given request, regardless of the size, but generally longer queries will have higher latency (time to first token).
Getting started with long context
Earlier versions of generative models were only able to process 8,000 tokens at a time. Newer models pushed this further by accepting 32,000 or even 128,000 tokens. Gemini is the first model capable of accepting 1 million tokens.

In practice, 1 million tokens would look like:

50,000 lines of code (with the standard 80 characters per line)
All the text messages you have sent in the last 5 years
8 average length English novels
Transcripts of over 200 average length podcast episodes
The more limited context windows common in many other models often require strategies like arbitrarily dropping old messages, summarizing content, using RAG with vector databases, or filtering prompts to save tokens.

While these techniques remain valuable in specific scenarios, Gemini's extensive context window invites a more direct approach: providing all relevant information upfront. Because Gemini models were purpose-built with massive context capabilities, they demonstrate powerful in-context learning. For example, using only in-context instructional materials (a 500-page reference grammar, a dictionary, and ≈400 parallel sentences), Gemini learned to translate from English to Kalamang—a Papuan language with fewer than 200 speakers—with quality similar to a human learner using the same materials. This illustrates the paradigm shift enabled by Gemini's long context, empowering new possibilities through robust in-context learning.

Long context use cases
While the standard use case for most generative models is still text input, the Gemini model family enables a new paradigm of multimodal use cases. These models can natively understand text, video, audio, and images. They are accompanied by the Gemini API that takes in multimodal file types for convenience.

Long form text
Text has proved to be the layer of intelligence underpinning much of the momentum around LLMs. As mentioned earlier, much of the practical limitation of LLMs was because of not having a large enough context window to do certain tasks. This led to the rapid adoption of retrieval augmented generation (RAG) and other techniques which dynamically provide the model with relevant contextual information. Now, with larger and larger context windows, there are new techniques becoming available which unlock new use cases.

Some emerging and standard use cases for text based long context include:

Summarizing large corpuses of text
Previous summarization options with smaller context models would require a sliding window or another technique to keep state of previous sections as new tokens are passed to the model
Question and answering
Historically this was only possible with RAG given the limited amount of context and models' factual recall being low
Agentic workflows
Text is the underpinning of how agents keep state of what they have done and what they need to do; not having enough information about the world and the agent's goal is a limitation on the reliability of agents
Many-shot in-context learning is one of the most unique capabilities unlocked by long context models. Research has shown that taking the common "single shot" or "multi-shot" example paradigm, where the model is presented with one or a few examples of a task, and scaling that up to hundreds, thousands, or even hundreds of thousands of examples, can lead to novel model capabilities. This many-shot approach has also been shown to perform similarly to models which were fine-tuned for a specific task. For use cases where a Gemini model's performance is not yet sufficient for a production rollout, you can try the many-shot approach. As you might explore later in the long context optimization section, context caching makes this type of high input token workload much more economically feasible and even lower latency in some cases.

Long form video
Video content's utility has long been constrained by the lack of accessibility of the medium itself. It was hard to skim the content, transcripts often failed to capture the nuance of a video, and most tools don't process image, text, and audio together. With Gemini, the long-context text capabilities translate to the ability to reason and answer questions about multimodal inputs with sustained performance.

Some emerging and standard use cases for video long context include:

Video question and answering
Video memory, as shown with Google's Project Astra
Video captioning
Video recommendation systems, by enriching existing metadata with new multimodal understanding
Video customization, by looking at a corpus of data and associated video metadata and then removing parts of videos that are not relevant to the viewer
Video content moderation
Real-time video processing
When working with videos, it is important to consider how the videos are processed into tokens, which affects billing and usage limits. You can learn more about prompting with video files in the Prompting guide.

Long form audio
The Gemini models were the first natively multimodal large language models that could understand audio. Historically, the typical developer workflow would involve stringing together multiple domain specific models, like a speech-to-text model and a text-to-text model, in order to process audio. This led to additional latency required by performing multiple round-trip requests and decreased performance usually attributed to disconnected architectures of the multiple model setup.

Some emerging and standard use cases for audio context include:

Real-time transcription and translation
Podcast / video question and answering
Meeting transcription and summarization
Voice assistants
You can learn more about prompting with audio files in the Prompting guide.

Long context optimizations
The primary optimization when working with long context and the Gemini models is to use context caching. Beyond the previous impossibility of processing lots of tokens in a single request, the other main constraint was the cost. If you have a "chat with your data" app where a user uploads 10 PDFs, a video, and some work documents, you would historically have to work with a more complex retrieval augmented generation (RAG) tool / framework in order to process these requests and pay a significant amount for tokens moved into the context window. Now, you can cache the files the user uploads and pay to store them on a per hour basis. The input / output cost per request with Gemini Flash for example is ~4x less than the standard input / output cost, so if the user chats with their data enough, it becomes a huge cost saving for you as the developer.

Long context limitations
In various sections of this guide, we talked about how Gemini models achieve high performance across various needle-in-a-haystack retrieval evals. These tests consider the most basic setup, where you have a single needle you are looking for. In cases where you might have multiple "needles" or specific pieces of information you are looking for, the model does not perform with the same accuracy. Performance can vary to a wide degree depending on the context. This is important to consider as there is an inherent tradeoff between getting the right information retrieved and cost. You can get ~99% on a single query, but you have to pay the input token cost every time you send that query. So for 100 pieces of information to be retrieved, if you needed 99% performance, you would likely need to send 100 requests. This is a good example of where context caching can significantly reduce the cost associated with using Gemini models while keeping the performance high.

FAQs
Where is the best place to put my query in the context window?
In most cases, especially if the total context is long, the model's performance will be better if you put your query / question at the end of the prompt (after all the other context).

Do I lose model performance when I add more tokens to a query?
Generally, if you don't need tokens to be passed to the model, it is best to avoid passing them. However, if you have a large chunk of tokens with some information and want to ask questions about that information, the model is highly capable of extracting that information (up to 99% accuracy in many cases).

How can I lower my cost with long-context queries?
If you have a similar set of tokens / context that you want to re-use many times, context caching can help reduce the costs associated with asking questions about that information.

Does the context length affect the model latency?
There is some fixed amount of latency in any given request, regardless of the size, but generally longer queries will have higher latency (time to first token).
Getting started with long context
Earlier versions of generative models were only able to process 8,000 tokens at a time. Newer models pushed this further by accepting 32,000 or even 128,000 tokens. Gemini is the first model capable of accepting 1 million tokens.

In practice, 1 million tokens would look like:

50,000 lines of code (with the standard 80 characters per line)
All the text messages you have sent in the last 5 years
8 average length English novels
Transcripts of over 200 average length podcast episodes
The more limited context windows common in many other models often require strategies like arbitrarily dropping old messages, summarizing content, using RAG with vector databases, or filtering prompts to save tokens.

While these techniques remain valuable in specific scenarios, Gemini's extensive context window invites a more direct approach: providing all relevant information upfront. Because Gemini models were purpose-built with massive context capabilities, they demonstrate powerful in-context learning. For example, using only in-context instructional materials (a 500-page reference grammar, a dictionary, and ≈400 parallel sentences), Gemini learned to translate from English to Kalamang—a Papuan language with fewer than 200 speakers—with quality similar to a human learner using the same materials. This illustrates the paradigm shift enabled by Gemini's long context, empowering new possibilities through robust in-context learning.

Long context use cases
While the standard use case for most generative models is still text input, the Gemini model family enables a new paradigm of multimodal use cases. These models can natively understand text, video, audio, and images. They are accompanied by the Gemini API that takes in multimodal file types for convenience.

Long form text
Text has proved to be the layer of intelligence underpinning much of the momentum around LLMs. As mentioned earlier, much of the practical limitation of LLMs was because of not having a large enough context window to do certain tasks. This led to the rapid adoption of retrieval augmented generation (RAG) and other techniques which dynamically provide the model with relevant contextual information. Now, with larger and larger context windows, there are new techniques becoming available which unlock new use cases.

Some emerging and standard use cases for text based long context include:

Summarizing large corpuses of text
Previous summarization options with smaller context models would require a sliding window or another technique to keep state of previous sections as new tokens are passed to the model
Question and answering
Historically this was only possible with RAG given the limited amount of context and models' factual recall being low
Agentic workflows
Text is the underpinning of how agents keep state of what they have done and what they need to do; not having enough information about the world and the agent's goal is a limitation on the reliability of agents
Many-shot in-context learning is one of the most unique capabilities unlocked by long context models. Research has shown that taking the common "single shot" or "multi-shot" example paradigm, where the model is presented with one or a few examples of a task, and scaling that up to hundreds, thousands, or even hundreds of thousands of examples, can lead to novel model capabilities. This many-shot approach has also been shown to perform similarly to models which were fine-tuned for a specific task. For use cases where a Gemini model's performance is not yet sufficient for a production rollout, you can try the many-shot approach. As you might explore later in the long context optimization section, context caching makes this type of high input token workload much more economically feasible and even lower latency in some cases.

Long form video
Video content's utility has long been constrained by the lack of accessibility of the medium itself. It was hard to skim the content, transcripts often failed to capture the nuance of a video, and most tools don't process image, text, and audio together. With Gemini, the long-context text capabilities translate to the ability to reason and answer questions about multimodal inputs with sustained performance.

Some emerging and standard use cases for video long context include:

Video question and answering
Video memory, as shown with Google's Project Astra
Video captioning
Video recommendation systems, by enriching existing metadata with new multimodal understanding
Video customization, by looking at a corpus of data and associated video metadata and then removing parts of videos that are not relevant to the viewer
Video content moderation
Real-time video processing
When working with videos, it is important to consider how the videos are processed into tokens, which affects billing and usage limits. You can learn more about prompting with video files in the Prompting guide.

Long form audio
The Gemini models were the first natively multimodal large language models that could understand audio. Historically, the typical developer workflow would involve stringing together multiple domain specific models, like a speech-to-text model and a text-to-text model, in order to process audio. This led to additional latency required by performing multiple round-trip requests and decreased performance usually attributed to disconnected architectures of the multiple model setup.

Some emerging and standard use cases for audio context include:

Real-time transcription and translation
Podcast / video question and answering
Meeting transcription and summarization
Voice assistants
You can learn more about prompting with audio files in the Prompting guide.

Long context optimizations
The primary optimization when working with long context and the Gemini models is to use context caching. Beyond the previous impossibility of processing lots of tokens in a single request, the other main constraint was the cost. If you have a "chat with your data" app where a user uploads 10 PDFs, a video, and some work documents, you would historically have to work with a more complex retrieval augmented generation (RAG) tool / framework in order to process these requests and pay a significant amount for tokens moved into the context window. Now, you can cache the files the user uploads and pay to store them on a per hour basis. The input / output cost per request with Gemini Flash for example is ~4x less than the standard input / output cost, so if the user chats with their data enough, it becomes a huge cost saving for you as the developer.

Long context limitations
In various sections of this guide, we talked about how Gemini models achieve high performance across various needle-in-a-haystack retrieval evals. These tests consider the most basic setup, where you have a single needle you are looking for. In cases where you might have multiple "needles" or specific pieces of information you are looking for, the model does not perform with the same accuracy. Performance can vary to a wide degree depending on the context. This is important to consider as there is an inherent tradeoff between getting the right information retrieved and cost. You can get ~99% on a single query, but you have to pay the input token cost every time you send that query. So for 100 pieces of information to be retrieved, if you needed 99% performance, you would likely need to send 100 requests. This is a good example of where context caching can significantly reduce the cost associated with using Gemini models while keeping the performance high.

FAQs
Where is the best place to put my query in the context window?
In most cases, especially if the total context is long, the model's performance will be better if you put your query / question at the end of the prompt (after all the other context).

Do I lose model performance when I add more tokens to a query?
Generally, if you don't need tokens to be passed to the model, it is best to avoid passing them. However, if you have a large chunk of tokens with some information and want to ask questions about that information, the model is highly capable of extracting that information (up to 99% accuracy in many cases).

How can I lower my cost with long-context queries?
If you have a similar set of tokens / context that you want to re-use many times, context caching can help reduce the costs associated with asking questions about that information.

Does the context length affect the model latency?
There is some fixed amount of latency in any given request, regardless of the size, but generally longer queries will have higher latency (time to first token).
Getting started with long context
Earlier versions of generative models were only able to process 8,000 tokens at a time. Newer models pushed this further by accepting 32,000 or even 128,000 tokens. Gemini is the first model capable of accepting 1 million tokens.

In practice, 1 million tokens would look like:

50,000 lines of code (with the standard 80 characters per line)
All the text messages you have sent in the last 5 years
8 average length English novels
Transcripts of over 200 average length podcast episodes
The more limited context windows common in many other models often require strategies like arbitrarily dropping old messages, summarizing content, using RAG with vector databases, or filtering prompts to save tokens.

While these techniques remain valuable in specific scenarios, Gemini's extensive context window invites a more direct approach: providing all relevant information upfront. Because Gemini models were purpose-built with massive context capabilities, they demonstrate powerful in-context learning. For example, using only in-context instructional materials (a 500-page reference grammar, a dictionary, and ≈400 parallel sentences), Gemini learned to translate from English to Kalamang—a Papuan language with fewer than 200 speakers—with quality similar to a human learner using the same materials. This illustrates the paradigm shift enabled by Gemini's long context, empowering new possibilities through robust in-context learning.

Long context use cases
While the standard use case for most generative models is still text input, the Gemini model family enables a new paradigm of multimodal use cases. These models can natively understand text, video, audio, and images. They are accompanied by the Gemini API that takes in multimodal file types for convenience.

Long form text
Text has proved to be the layer of intelligence underpinning much of the momentum around LLMs. As mentioned earlier, much of the practical limitation of LLMs was because of not having a large enough context window to do certain tasks. This led to the rapid adoption of retrieval augmented generation (RAG) and other techniques which dynamically provide the model with relevant contextual information. Now, with larger and larger context windows, there are new techniques becoming available which unlock new use cases.

Some emerging and standard use cases for text based long context include:

Summarizing large corpuses of text
Previous summarization options with smaller context models would require a sliding window or another technique to keep state of previous sections as new tokens are passed to the model
Question and answering
Historically this was only possible with RAG given the limited amount of context and models' factual recall being low
Agentic workflows
Text is the underpinning of how agents keep state of what they have done and what they need to do; not having enough information about the world and the agent's goal is a limitation on the reliability of agents
Many-shot in-context learning is one of the most unique capabilities unlocked by long context models. Research has shown that taking the common "single shot" or "multi-shot" example paradigm, where the model is presented with one or a few examples of a task, and scaling that up to hundreds, thousands, or even hundreds of thousands of examples, can lead to novel model capabilities. This many-shot approach has also been shown to perform similarly to models which were fine-tuned for a specific task. For use cases where a Gemini model's performance is not yet sufficient for a production rollout, you can try the many-shot approach. As you might explore later in the long context optimization section, context caching makes this type of high input token workload much more economically feasible and even lower latency in some cases.

Long form video
Video content's utility has long been constrained by the lack of accessibility of the medium itself. It was hard to skim the content, transcripts often failed to capture the nuance of a video, and most tools don't process image, text, and audio together. With Gemini, the long-context text capabilities translate to the ability to reason and answer questions about multimodal inputs with sustained performance.

Some emerging and standard use cases for video long context include:

Video question and answering
Video memory, as shown with Google's Project Astra
Video captioning
Video recommendation systems, by enriching existing metadata with new multimodal understanding
Video customization, by looking at a corpus of data and associated video metadata and then removing parts of videos that are not relevant to the viewer
Video content moderation
Real-time video processing
When working with videos, it is important to consider how the videos are processed into tokens, which affects billing and usage limits. You can learn more about prompting with video files in the Prompting guide.

Long form audio
The Gemini models were the first natively multimodal large language models that could understand audio. Historically, the typical developer workflow would involve stringing together multiple domain specific models, like a speech-to-text model and a text-to-text model, in order to process audio. This led to additional latency required by performing multiple round-trip requests and decreased performance usually attributed to disconnected architectures of the multiple model setup.

Some emerging and standard use cases for audio context include:

Real-time transcription and translation
Podcast / video question and answering
Meeting transcription and summarization
Voice assistants
You can learn more about prompting with audio files in the Prompting guide.

Long context optimizations
The primary optimization when working with long context and the Gemini models is to use context caching. Beyond the previous impossibility of processing lots of tokens in a single request, the other main constraint was the cost. If you have a "chat with your data" app where a user uploads 10 PDFs, a video, and some work documents, you would historically have to work with a more complex retrieval augmented generation (RAG) tool / framework in order to process these requests and pay a significant amount for tokens moved into the context window. Now, you can cache the files the user uploads and pay to store them on a per hour basis. The input / output cost per request with Gemini Flash for example is ~4x less than the standard input / output cost, so if the user chats with their data enough, it becomes a huge cost saving for you as the developer.

Long context limitations
In various sections of this guide, we talked about how Gemini models achieve high performance across various needle-in-a-haystack retrieval evals. These tests consider the most basic setup, where you have a single needle you are looking for. In cases where you might have multiple "needles" or specific pieces of information you are looking for, the model does not perform with the same accuracy. Performance can vary to a wide degree depending on the context. This is important to consider as there is an inherent tradeoff between getting the right information retrieved and cost. You can get ~99% on a single query, but you have to pay the input token cost every time you send that query. So for 100 pieces of information to be retrieved, if you needed 99% performance, you would likely need to send 100 requests. This is a good example of where context caching can significantly reduce the cost associated with using Gemini models while keeping the performance high.

FAQs
Where is the best place to put my query in the context window?
In most cases, especially if the total context is long, the model's performance will be better if you put your query / question at the end of the prompt (after all the other context).

Do I lose model performance when I add more tokens to a query?
Generally, if you don't need tokens to be passed to the model, it is best to avoid passing them. However, if you have a large chunk of tokens with some information and want to ask questions about that information, the model is highly capable of extracting that information (up to 99% accuracy in many cases).

How can I lower my cost with long-context queries?
If you have a similar set of tokens / context that you want to re-use many times, context caching can help reduce the costs associated with asking questions about that information.

Does the context length affect the model latency?
There is some fixed amount of latency in any given request, regardless of the size, but generally longer queries will have higher latency (time to first token).
Getting started with long context
Earlier versions of generative models were only able to process 8,000 tokens at a time. Newer models pushed this further by accepting 32,000 or even 128,000 tokens. Gemini is the first model capable of accepting 1 million tokens.

In practice, 1 million tokens would look like:

50,000 lines of code (with the standard 80 characters per line)
All the text messages you have sent in the last 5 years
8 average length English novels
Transcripts of over 200 average length podcast episodes
The more limited context windows common in many other models often require strategies like arbitrarily dropping old messages, summarizing content, using RAG with vector databases, or filtering prompts to save tokens.

While these techniques remain valuable in specific scenarios, Gemini's extensive context window invites a more direct approach: providing all relevant information upfront. Because Gemini models were purpose-built with massive context capabilities, they demonstrate powerful in-context learning. For example, using only in-context instructional materials (a 500-page reference grammar, a dictionary, and ≈400 parallel sentences), Gemini learned to translate from English to Kalamang—a Papuan language with fewer than 200 speakers—with quality similar to a human learner using the same materials. This illustrates the paradigm shift enabled by Gemini's long context, empowering new possibilities through robust in-context learning.

Long context use cases
While the standard use case for most generative models is still text input, the Gemini model family enables a new paradigm of multimodal use cases. These models can natively understand text, video, audio, and images. They are accompanied by the Gemini API that takes in multimodal file types for convenience.

Long form text
Text has proved to be the layer of intelligence underpinning much of the momentum around LLMs. As mentioned earlier, much of the practical limitation of LLMs was because of not having a large enough context window to do certain tasks. This led to the rapid adoption of retrieval augmented generation (RAG) and other techniques which dynamically provide the model with relevant contextual information. Now, with larger and larger context windows, there are new techniques becoming available which unlock new use cases.

Some emerging and standard use cases for text based long context include:

Summarizing large corpuses of text
Previous summarization options with smaller context models would require a sliding window or another technique to keep state of previous sections as new tokens are passed to the model
Question and answering
Historically this was only possible with RAG given the limited amount of context and models' factual recall being low
Agentic workflows
Text is the underpinning of how agents keep state of what they have done and what they need to do; not having enough information about the world and the agent's goal is a limitation on the reliability of agents
Many-shot in-context learning is one of the most unique capabilities unlocked by long context models. Research has shown that taking the common "single shot" or "multi-shot" example paradigm, where the model is presented with one or a few examples of a task, and scaling that up to hundreds, thousands, or even hundreds of thousands of examples, can lead to novel model capabilities. This many-shot approach has also been shown to perform similarly to models which were fine-tuned for a specific task. For use cases where a Gemini model's performance is not yet sufficient for a production rollout, you can try the many-shot approach. As you might explore later in the long context optimization section, context caching makes this type of high input token workload much more economically feasible and even lower latency in some cases.

Long form video
Video content's utility has long been constrained by the lack of accessibility of the medium itself. It was hard to skim the content, transcripts often failed to capture the nuance of a video, and most tools don't process image, text, and audio together. With Gemini, the long-context text capabilities translate to the ability to reason and answer questions about multimodal inputs with sustained performance.

Some emerging and standard use cases for video long context include:

Video question and answering
Video memory, as shown with Google's Project Astra
Video captioning
Video recommendation systems, by enriching existing metadata with new multimodal understanding
Video customization, by looking at a corpus of data and associated video metadata and then removing parts of videos that are not relevant to the viewer
Video content moderation
Real-time video processing
When working with videos, it is important to consider how the videos are processed into tokens, which affects billing and usage limits. You can learn more about prompting with video files in the Prompting guide.

Long form audio
The Gemini models were the first natively multimodal large language models that could understand audio. Historically, the typical developer workflow would involve stringing together multiple domain specific models, like a speech-to-text model and a text-to-text model, in order to process audio. This led to additional latency required by performing multiple round-trip requests and decreased performance usually attributed to disconnected architectures of the multiple model setup.

Some emerging and standard use cases for audio context include:

Real-time transcription and translation
Podcast / video question and answering
Meeting transcription and summarization
Voice assistants
You can learn more about prompting with audio files in the Prompting guide.

Long context optimizations
The primary optimization when working with long context and the Gemini models is to use context caching. Beyond the previous impossibility of processing lots of tokens in a single request, the other main constraint was the cost. If you have a "chat with your data" app where a user uploads 10 PDFs, a video, and some work documents, you would historically have to work with a more complex retrieval augmented generation (RAG) tool / framework in order to process these requests and pay a significant amount for tokens moved into the context window. Now, you can cache the files the user uploads and pay to store them on a per hour basis. The input / output cost per request with Gemini Flash for example is ~4x less than the standard input / output cost, so if the user chats with their data enough, it becomes a huge cost saving for you as the developer.

Long context limitations
In various sections of this guide, we talked about how Gemini models achieve high performance across various needle-in-a-haystack retrieval evals. These tests consider the most basic setup, where you have a single needle you are looking for. In cases where you might have multiple "needles" or specific pieces of information you are looking for, the model does not perform with the same accuracy. Performance can vary to a wide degree depending on the context. This is important to consider as there is an inherent tradeoff between getting the right information retrieved and cost. You can get ~99% on a single query, but you have to pay the input token cost every time you send that query. So for 100 pieces of information to be retrieved, if you needed 99% performance, you would likely need to send 100 requests. This is a good example of where context caching can significantly reduce the cost associated with using Gemini models while keeping the performance high.

FAQs
Where is the best place to put my query in the context window?
In most cases, especially if the total context is long, the model's performance will be better if you put your query / question at the end of the prompt (after all the other context).

Do I lose model performance when I add more tokens to a query?
Generally, if you don't need tokens to be passed to the model, it is best to avoid passing them. However, if you have a large chunk of tokens with some information and want to ask questions about that information, the model is highly capable of extracting that information (up to 99% accuracy in many cases).

How can I lower my cost with long-context queries?
If you have a similar set of tokens / context that you want to re-use many times, context caching can help reduce the costs associated with asking questions about that information.

Does the context length affect the model latency?
There is some fixed amount of latency in any given request, regardless of the size, but generally longer queries will have higher latency (time to first token).
Getting started with long context
Earlier versions of generative models were only able to process 8,000 tokens at a time. Newer models pushed this further by accepting 32,000 or even 128,000 tokens. Gemini is the first model capable of accepting 1 million tokens.

In practice, 1 million tokens would look like:

50,000 lines of code (with the standard 80 characters per line)
All the text messages you have sent in the last 5 years
8 average length English novels
Transcripts of over 200 average length podcast episodes
The more limited context windows common in many other models often require strategies like arbitrarily dropping old messages, summarizing content, using RAG with vector databases, or filtering prompts to save tokens.

While these techniques remain valuable in specific scenarios, Gemini's extensive context window invites a more direct approach: providing all relevant information upfront. Because Gemini models were purpose-built with massive context capabilities, they demonstrate powerful in-context learning. For example, using only in-context instructional materials (a 500-page reference grammar, a dictionary, and ≈400 parallel sentences), Gemini learned to translate from English to Kalamang—a Papuan language with fewer than 200 speakers—with quality similar to a human learner using the same materials. This illustrates the paradigm shift enabled by Gemini's long context, empowering new possibilities through robust in-context learning.

Long context use cases
While the standard use case for most generative models is still text input, the Gemini model family enables a new paradigm of multimodal use cases. These models can natively understand text, video, audio, and images. They are accompanied by the Gemini API that takes in multimodal file types for convenience.

Long form text
Text has proved to be the layer of intelligence underpinning much of the momentum around LLMs. As mentioned earlier, much of the practical limitation of LLMs was because of not having a large enough context window to do certain tasks. This led to the rapid adoption of retrieval augmented generation (RAG) and other techniques which dynamically provide the model with relevant contextual information. Now, with larger and larger context windows, there are new techniques becoming available which unlock new use cases.

Some emerging and standard use cases for text based long context include:

Summarizing large corpuses of text
Previous summarization options with smaller context models would require a sliding window or another technique to keep state of previous sections as new tokens are passed to the model
Question and answering
Historically this was only possible with RAG given the limited amount of context and models' factual recall being low
Agentic workflows
Text is the underpinning of how agents keep state of what they have done and what they need to do; not having enough information about the world and the agent's goal is a limitation on the reliability of agents
Many-shot in-context learning is one of the most unique capabilities unlocked by long context models. Research has shown that taking the common "single shot" or "multi-shot" example paradigm, where the model is presented with one or a few examples of a task, and scaling that up to hundreds, thousands, or even hundreds of thousands of examples, can lead to novel model capabilities. This many-shot approach has also been shown to perform similarly to models which were fine-tuned for a specific task. For use cases where a Gemini model's performance is not yet sufficient for a production rollout, you can try the many-shot approach. As you might explore later in the long context optimization section, context caching makes this type of high input token workload much more economically feasible and even lower latency in some cases.

Long form video
Video content's utility has long been constrained by the lack of accessibility of the medium itself. It was hard to skim the content, transcripts often failed to capture the nuance of a video, and most tools don't process image, text, and audio together. With Gemini, the long-context text capabilities translate to the ability to reason and answer questions about multimodal inputs with sustained performance.

Some emerging and standard use cases for video long context include:

Video question and answering
Video memory, as shown with Google's Project Astra
Video captioning
Video recommendation systems, by enriching existing metadata with new multimodal understanding
Video customization, by looking at a corpus of data and associated video metadata and then removing parts of videos that are not relevant to the viewer
Video content moderation
Real-time video processing
When working with videos, it is important to consider how the videos are processed into tokens, which affects billing and usage limits. You can learn more about prompting with video files in the Prompting guide.

Long form audio
The Gemini models were the first natively multimodal large language models that could understand audio. Historically, the typical developer workflow would involve stringing together multiple domain specific models, like a speech-to-text model and a text-to-text model, in order to process audio. This led to additional latency required by performing multiple round-trip requests and decreased performance usually attributed to disconnected architectures of the multiple model setup.

Some emerging and standard use cases for audio context include:

Real-time transcription and translation
Podcast / video question and answering
Meeting transcription and summarization
Voice assistants
You can learn more about prompting with audio files in the Prompting guide.

Long context optimizations
The primary optimization when working with long context and the Gemini models is to use context caching. Beyond the previous impossibility of processing lots of tokens in a single request, the other main constraint was the cost. If you have a "chat with your data" app where a user uploads 10 PDFs, a video, and some work documents, you would historically have to work with a more complex retrieval augmented generation (RAG) tool / framework in order to process these requests and pay a significant amount for tokens moved into the context window. Now, you can cache the files the user uploads and pay to store them on a per hour basis. The input / output cost per request with Gemini Flash for example is ~4x less than the standard input / output cost, so if the user chats with their data enough, it becomes a huge cost saving for you as the developer.

Long context limitations
In various sections of this guide, we talked about how Gemini models achieve high performance across various needle-in-a-haystack retrieval evals. These tests consider the most basic setup, where you have a single needle you are looking for. In cases where you might have multiple "needles" or specific pieces of information you are looking for, the model does not perform with the same accuracy. Performance can vary to a wide degree depending on the context. This is important to consider as there is an inherent tradeoff between getting the right information retrieved and cost. You can get ~99% on a single query, but you have to pay the input token cost every time you send that query. So for 100 pieces of information to be retrieved, if you needed 99% performance, you would likely need to send 100 requests. This is a good example of where context caching can significantly reduce the cost associated with using Gemini models while keeping the performance high.

FAQs
Where is the best place to put my query in the context window?
In most cases, especially if the total context is long, the model's performance will be better if you put your query / question at the end of the prompt (after all the other context).

Do I lose model performance when I add more tokens to a query?
Generally, if you don't need tokens to be passed to the model, it is best to avoid passing them. However, if you have a large chunk of tokens with some information and want to ask questions about that information, the model is highly capable of extracting that information (up to 99% accuracy in many cases).

How can I lower my cost with long-context queries?
If you have a similar set of tokens / context that you want to re-use many times, context caching can help reduce the costs associated with asking questions about that information.

Does the context length affect the model latency?
There is some fixed amount of latency in any given request, regardless of the size, but generally longer queries will have higher latency (time to first token).
Getting started with long context
Earlier versions of generative models were only able to process 8,000 tokens at a time. Newer models pushed this further by accepting 32,000 or even 128,000 tokens. Gemini is the first model capable of accepting 1 million tokens.

In practice, 1 million tokens would look like:

50,000 lines of code (with the standard 80 characters per line)
All the text messages you have sent in the last 5 years
8 average length English novels
Transcripts of over 200 average length podcast episodes
The more limited context windows common in many other models often require strategies like arbitrarily dropping old messages, summarizing content, using RAG with vector databases, or filtering prompts to save tokens.

While these techniques remain valuable in specific scenarios, Gemini's extensive context window invites a more direct approach: providing all relevant information upfront. Because Gemini models were purpose-built with massive context capabilities, they demonstrate powerful in-context learning. For example, using only in-context instructional materials (a 500-page reference grammar, a dictionary, and ≈400 parallel sentences), Gemini learned to translate from English to Kalamang—a Papuan language with fewer than 200 speakers—with quality similar to a human learner using the same materials. This illustrates the paradigm shift enabled by Gemini's long context, empowering new possibilities through robust in-context learning.

Long context use cases
While the standard use case for most generative models is still text input, the Gemini model family enables a new paradigm of multimodal use cases. These models can natively understand text, video, audio, and images. They are accompanied by the Gemini API that takes in multimodal file types for convenience.

Long form text
Text has proved to be the layer of intelligence underpinning much of the momentum around LLMs. As mentioned earlier, much of the practical limitation of LLMs was because of not having a large enough context window to do certain tasks. This led to the rapid adoption of retrieval augmented generation (RAG) and other techniques which dynamically provide the model with relevant contextual information. Now, with larger and larger context windows, there are new techniques becoming available which unlock new use cases.

Some emerging and standard use cases for text based long context include:

Summarizing large corpuses of text
Previous summarization options with smaller context models would require a sliding window or another technique to keep state of previous sections as new tokens are passed to the model
Question and answering
Historically this was only possible with RAG given the limited amount of context and models' factual recall being low
Agentic workflows
Text is the underpinning of how agents keep state of what they have done and what they need to do; not having enough information about the world and the agent's goal is a limitation on the reliability of agents
Many-shot in-context learning is one of the most unique capabilities unlocked by long context models. Research has shown that taking the common "single shot" or "multi-shot" example paradigm, where the model is presented with one or a few examples of a task, and scaling that up to hundreds, thousands, or even hundreds of thousands of examples, can lead to novel model capabilities. This many-shot approach has also been shown to perform similarly to models which were fine-tuned for a specific task. For use cases where a Gemini model's performance is not yet sufficient for a production rollout, you can try the many-shot approach. As you might explore later in the long context optimization section, context caching makes this type of high input token workload much more economically feasible and even lower latency in some cases.

Long form video
Video content's utility has long been constrained by the lack of accessibility of the medium itself. It was hard to skim the content, transcripts often failed to capture the nuance of a video, and most tools don't process image, text, and audio together. With Gemini, the long-context text capabilities translate to the ability to reason and answer questions about multimodal inputs with sustained performance.

Some emerging and standard use cases for video long context include:

Video question and answering
Video memory, as shown with Google's Project Astra
Video captioning
Video recommendation systems, by enriching existing metadata with new multimodal understanding
Video customization, by looking at a corpus of data and associated video metadata and then removing parts of videos that are not relevant to the viewer
Video content moderation
Real-time video processing
When working with videos, it is important to consider how the videos are processed into tokens, which affects billing and usage limits. You can learn more about prompting with video files in the Prompting guide.

Long form audio
The Gemini models were the first natively multimodal large language models that could understand audio. Historically, the typical developer workflow would involve stringing together multiple domain specific models, like a speech-to-text model and a text-to-text model, in order to process audio. This led to additional latency required by performing multiple round-trip requests and decreased performance usually attributed to disconnected architectures of the multiple model setup.

Some emerging and standard use cases for audio context include:

Real-time transcription and translation
Podcast / video question and answering
Meeting transcription and summarization
Voice assistants
You can learn more about prompting with audio files in the Prompting guide.

Long context optimizations
The primary optimization when working with long context and the Gemini models is to use context caching. Beyond the previous impossibility of processing lots of tokens in a single request, the other main constraint was the cost. If you have a "chat with your data" app where a user uploads 10 PDFs, a video, and some work documents, you would historically have to work with a more complex retrieval augmented generation (RAG) tool / framework in order to process these requests and pay a significant amount for tokens moved into the context window. Now, you can cache the files the user uploads and pay to store them on a per hour basis. The input / output cost per request with Gemini Flash for example is ~4x less than the standard input / output cost, so if the user chats with their data enough, it becomes a huge cost saving for you as the developer.

Long context limitations
In various sections of this guide, we talked about how Gemini models achieve high performance across various needle-in-a-haystack retrieval evals. These tests consider the most basic setup, where you have a single needle you are looking for. In cases where you might have multiple "needles" or specific pieces of information you are looking for, the model does not perform with the same accuracy. Performance can vary to a wide degree depending on the context. This is important to consider as there is an inherent tradeoff between getting the right information retrieved and cost. You can get ~99% on a single query, but you have to pay the input token cost every time you send that query. So for 100 pieces of information to be retrieved, if you needed 99% performance, you would likely need to send 100 requests. This is a good example of where context caching can significantly reduce the cost associated with using Gemini models while keeping the performance high.

FAQs
Where is the best place to put my query in the context window?
In most cases, especially if the total context is long, the model's performance will be better if you put your query / question at the end of the prompt (after all the other context).

Do I lose model performance when I add more tokens to a query?
Generally, if you don't need tokens to be passed to the model, it is best to avoid passing them. However, if you have a large chunk of tokens with some information and want to ask questions about that information, the model is highly capable of extracting that information (up to 99% accuracy in many cases).

How can I lower my cost with long-context queries?
If you have a similar set of tokens / context that you want to re-use many times, context caching can help reduce the costs associated with asking questions about that information.

Does the context length affect the model latency?
There is some fixed amount of latency in any given request, regardless of the size, but generally longer queries will have higher latency (time to first token).`;
