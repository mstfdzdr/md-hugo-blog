---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
subtitle: ""
# Shown in search results and link previews; leave empty to use the first paragraph
description: ""
date: {{ .Date }}
lastmod: {{ .Date }}
# article (default): summary + "read more" on the home page
# snippet: full content on the home page
# video: video + full content on the home page (needs `video`)
postType: article
# true: show the whole post on the home page instead of a summary + "read more"
fullContent: false
tags: []
categories: []
featuredImage: ""
draft: true
hiddenFromHomePage: false
toc: false
code:
  maxShownLines: 50
---
