---
name: notify
description: Unified notification routing across macOS, push, SMS, and email
cli: notify
data_dir: none
version: 0.1.0
health_check: notify channels
depends_on:
  - registry
---

Notify routes alerts to the best available channel based on priority. It reads available channels from the Registry and delivers messages accordingly.
