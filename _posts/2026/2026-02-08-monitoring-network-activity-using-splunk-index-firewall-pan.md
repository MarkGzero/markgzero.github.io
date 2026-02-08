---
layout: post
title: "Monitoring Network Activity using Splunk index firewall-pan"
date: 2026-02-08
excerpt: >-
  Splunk query to monitor network traffic using firewall-pan index.
tags: [splunk, network, cybersecurity]
categories: [tutorial, tips]
comments: true
---

Just a quick query that might be useful. The goal here is to monitor network traffic using Splunk index firewall-pan. Just a baseline for suspicious-traffic monitoring.

- Prevent silent drops due to fields missing value (null)
- Explicit visibility into missing firewall metadata
- Port classification to reduce noise
- Clean columns for review or alerting


{% include codeHeader.html %}
```sql
index=firewall-pan 
src_ip IN (192.168.4.115,192.168.4.120,192.168.4.130) 
OR 
dest_ip IN (192.168.4.115,192.168.4.120,192.168.4.130)
| eval src_dest = src_ip." → ".dest_ip
| foreach dest_zone dest_interface dest_port protocol rule [
 eval <<FIELD>> = coalesce(<<FIELD>>, "NULL")
 ]
| eval port_class = if(dest_port >= 49152, "ephemeral", "well_known")
| stats count AS count
  BY src_dest, dest_zone, dest_interface, dest_port, port_class, protocol, rule
| rename dest_port AS port
| sort - count
```

The functions used here as follows:

| SPL Command / Function | Used As                                                               | What It Does                                                     | Why It Matters Here                                      |
| ---------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------- |
| `eval`                 | `eval src_dest = src_ip." → ".dest_ip`                                | Creates a new field by concatenating source and destination IPs  | Makes communication pairs explicit and readable          |
| `foreach`              | `foreach dest_zone dest_interface dest_port protocol rule [...]`      | Iterates over multiple fields and applies the same logic to each | Ensures consistent handling of critical metadata         |
| `coalesce()`           | `coalesce(field, "NULL")`                                             | Replaces NULL or missing values with `"NULL"`                    | Prevents silent data loss during aggregation             |
| `eval`                 | `eval port_class = if(dest_port >= 49152, "ephemeral", "well_known")` | Classifies ports by range                                        | Reduces noise and highlights suspicious well-known ports |
| `stats`                | `stats count AS count BY ...`                                         | Aggregates events into grouped rows and counts them              | Converts raw logs into analyzable relationships          |
| `rename`               | `rename dest_port AS port`                                            | Renames a field                                                  | Improves column clarity for review and reporting         |
| `sort`                 | `sort - count`                                                        | Sorts results in descending order                                | Surfaces the busiest or most repeated connections        |

