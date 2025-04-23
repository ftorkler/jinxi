#!/usr/bin/env node

import { parseInxiOutput } from "./inxi_parser";
import { spawnSync } from "child_process";

const UTF8 = "utf8";
const EXIT_STATUS_SUCCESS = 0;

const args = process.argv.slice(2).join(" ");
const result = spawnSync(`inxi ${args} -y1 -c0`, {
  encoding: UTF8,
  shell: true,
});

if (result.status == EXIT_STATUS_SUCCESS) {
  const out = parseInxiOutput(result.stdout);
  process.stdout.write(out + "\n", UTF8);
} else {
  process.stdout.write(result.stdout || "", UTF8);
  process.stderr.write(result.stderr || "", UTF8);
}

process.exit(result.status);
