#!/usr/bin/env node

import { Command } from "commander";
import { send, getChannels } from "./router.js";
import { installSkill } from "./templates/skill.md.js";
import type { Priority } from "./types.js";

const program = new Command();

program
  .name("notify")
  .description("Unified notification routing for the MeshVibe ecosystem")
  .version("0.1.0");

program
  .command("send <message>")
  .description("Send a notification")
  .option("-t, --title <title>", "notification title", "MeshVibe")
  .option("-p, --priority <level>", "priority: low|medium|high|critical", "medium")
  .option("-c, --channel <name>", "send to specific channel only")
  .action((message: string, opts: { title: string; priority: string; channel?: string }) => {
    const results = send(message, {
      title: opts.title,
      priority: opts.priority as Priority,
      channel: opts.channel,
    });

    for (const r of results) {
      if (r.success) {
        console.log(`Sent via ${r.channel}`);
      } else {
        console.error(`Failed on ${r.channel}: ${r.error}`);
      }
    }
  });

program
  .command("channels")
  .description("List available notification channels")
  .action(() => {
    const channels = getChannels();
    if (channels.length === 0) {
      console.log("No channels available.");
      return;
    }

    console.log(`\n  ${"Channel".padEnd(14)} ${"Type".padEnd(12)} ${"Min Priority".padEnd(14)} Available`);
    console.log(`  ${"─".repeat(14)} ${"─".repeat(12)} ${"─".repeat(14)} ${"─".repeat(10)}`);

    for (const ch of channels) {
      console.log(`  ${ch.name.padEnd(14)} ${ch.type.padEnd(12)} ${ch.minPriority.padEnd(14)} ${ch.available ? "yes" : "no"}`);
    }
    console.log();
  });

program
  .command("test")
  .description("Send a test notification to all channels")
  .action(() => {
    const results = send("This is a test notification from MeshVibe notify.", {
      title: "MeshVibe Test",
      priority: "critical",
    });

    for (const r of results) {
      if (r.success) {
        console.log(`OK: ${r.channel}`);
      } else {
        console.error(`FAIL: ${r.channel} — ${r.error}`);
      }
    }
  });

program
  .command("init")
  .description("Install Claude Code skill")
  .action(() => {
    installSkill();
    console.log("Installed skill to ~/.claude/skills/notify/SKILL.md");
  });

program.parse();
