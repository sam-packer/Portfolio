---
title: Notetaker
description: "Use artificial intelligence to take notes for you from video transcripts"
url: https://github.com/sam-packer/Notetaker
pubDate: "February 7, 2025"
badge: "NEW"
image: "/Notetaker.webp"
tags: [ "Python", "Artificial Intelligence", "AI Workflows", "OpenAI" ]
---

Are you someone who prefers to read rather than watch videos like me? Yes? Then maybe you know the struggle of when a
platform is video first with their content. Coursera is an excellent site, but also uses videos as their primary method
of instruction. I built this project to generate structured notes from Coursera course materials using AI. The process
involves downloading course content and leveraging the OpenAI API to summarize English transcripts into digestible
bullet points. The summarized notes are then formatted for use in Obsidian, a popular note-taking management tool, and
a little magic to rename the files into an ordered structure.

#### Extracting Course Content

I used a tool to download all course materials from Coursera (which is allowed under their Terms of Service). I focused
specifically on using the English transcripts as my foundation for generating notes.

#### AI Powered Summarization

To transform lengthy transcripts into clear, but rememberable, bullet points, I used the OpenAI API. I actually used
DeepSeek V3 as my AI model for its excellent writing capabilities.

#### Optimizing the Prompt

I experimented with and refined my prompts for the DeepSeek model to ensure high-quality summaries while keeping costs
low. This experience taught me the importance of prompt engineering in controlling API usage and expenses. With a badly
optimized prompt, the costs skyrocketed.

#### Obsidian Integration

I automated the conversion of summarized notes into Markdown files, which is what Obsidian uses. I built some logic to
rename each course, module, section, and video for easier organization. It was a goal of mine to be able to look at
these notes much later on.

This project taught me a use case of AI to simplify and enhance how I learn. By automating the
summarization and organization of course content, I created a system that makes it easier for me to study the material
more effectively. It's much easier to turn notes into flashcards or other materials than a video. Developing this
process also deepened my
understanding of nuances of selecting an AI model and tweaking the `temperature` and `top_p` parameters. The most
interesting part to me was the prompt engineering and how that can have a drastic effect on the quality. Integrating the
results into Obsidian allowed me to maintain an easily accessible and organized structure of the notes which has been
invaluable for my personal and professional growth.