---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
# Shown in search results and link previews; leave empty to use the first paragraph
description: ""
date: {{ .Date }}
# Video on top, then the full text, on the home page
postType: video
# YouTube URL or ID, or a video file in this page's folder
video: ""
tags: []
categories: []
draft: true
toc: false
---
