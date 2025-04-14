---
title: Spacerouter
description: "Middleware for AI that uses a neural network classifier to redirect math related questions to Wolfram Alpha instead of a LLM for more accurate results."
url: "https://github.com/sam-packer/Spacerouter"
pinned: false
pubDate: "February 27, 2025"
image: "../../assets/projects/Spacerouter.webp"
tags: [ "Python", "Artificial Intelligence", "Neural Network" ]
---

I had a little thought experiment: we know that generative AI is not very good at math. So what if I could build some
"middleware" for AI that sends math requests to Wolfram Alpha, but keeps generative AI for the things it is good at. I
built a neural network classifier that can determine whether a piece of text is likely to be a math question or not. The
answer is that it *does* seem to be better than ChatGPT without the middleware. However, Wolfram Alpha cannot answer
every math question either. This can be an advantage or disadvantage depending on the way you see it. If it can't be
definitively solved, it won't solve at all. However, there's a chance you're missing out on a solution that might or
might not be correct. The biggest challenge was training the neural network. There is a lot of work to be done to
increase the accuracy. In the future, it would be interesting to improve the neural network to classify more types of
information and send them out to various third parties.