---
title: Notetaker
description: "Use artificial intelligence to take notes for you from video transcripts"
url: https://github.com/sam-packer/Notetaker
pubDate: "February 7, 2025"
badge: "NEW"
image: "/Notetaker.webp"
tags: [ "Python", "Artificial Intelligence", "AI Workflows", "OpenAI" ]
---

This project demonstrates the development of an automated pipeline for generating concise, structured notes from
Coursera course materials using AI. The process involves downloading course content, including videos and transcripts,
and leveraging the OpenAI API to summarize English transcripts into digestible bullet points. The summarized notes are
then formatted for use in Obsidian, a popular knowledge management tool, and seamlessly integrated into an Obsidian
Vault for efficient organization and retrieval.

#### Extracting Course Content

I used a specialized tool to download all course materials from Coursera. I focused specifically on using the English
transcripts as the foundation for generating my notes.

#### AI-Powered Summarization

To transform lengthy transcripts into clear, actionable bullet points, I integrated the OpenAI API into my workflow. I
chose the gpt-4o-mini model for its balance of cost-effectiveness and performance, which allowed me to process 118
files for just $0.15, which is equivalent to the content of three full courses.

#### Optimizing the Prompt

I experimented with and refined my prompts for the OpenAI API to ensure high-quality summaries while keeping costs low.
This experience taught me the importance of prompt engineering in controlling API usage and expenses.

#### Obsidian Integration

I automated the conversion of summarized notes into Obsidian-compatible Markdown format and organized them directly into
my Obsidian Vault. This made it effortless to access, search, and build upon my notes over time.

This project reflects my ability to harness AI to simplify and enhance learning workflows. By automating the
summarization and organization of course content, I created a system that saves time and improves knowledge retention.
It also deepened my understanding of cost-effective AI model selection and the nuances of prompt optimization.
Integrating the results into Obsidian allowed me to maintain a centralized, easily accessible repository of knowledge,
which has been invaluable for my personal and professional growth.