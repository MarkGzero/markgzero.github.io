---
layout: post
title: "Using Splunk and Armis index to get an inventory list"
date: 2026-02-08
excerpt: >-
  Could be useful for inventory checks.
comments: true
---

Just a quick Splunk query to take advantage of the Armis index, in case its available. This is helpful for getting an inventory list based on a subnet or VLAN. 

{% include codeHeader.html %}
```sql
index=armis
| where cidrmatch("192.168.1.0/24",ip) 
OR cidrmatch("192.168.1.0/24",ipaddress)
| dedup ip,ipaddress
| table asset_model,category,index,ip,ipaddress,mac,macaddress,manufacturer,
name,operatingsystem
```

The functions used here are:

| Function      | Description                                                              |
| ------------- | ------------------------------------------------------------------------ |
| `cidrmatch()` | Checks if an IP address falls within a given CIDR block.                 |
| `where`       | Filters results based on an expression (similar to `if` or SQL `WHERE`). |
| `dedup`       | Removes duplicate events based on specified fields (`ip`, `ipaddress`).  |
| `table`       | Selects and formats fields to display in a tabular format.               |

