#!/usr/bin/env node

import { spawnSync } from "child_process";

const LF = "\n";
const UTF8 = "utf8";
const EXIT_STATUS_SUCCESS = 0;

String.prototype.indentation = function () {
  for (let i = 0; i < this.length; ++i) {
    if (this[i] !== " ") return i;
  }
  return -1;
};

function parseInxiOutput(inxiOutput) {
  const root = {};
  const obj_stack = [root];
  let cur_obj = root;
  let last_level = -1;

  inxiOutput
    .split(LF)
    .filter((line) => line)
    .forEach((line) => {
      const cur_level = line.indentation() / 2;
      while (cur_level <= last_level) {
        obj_stack.pop();
        cur_obj = obj_stack[obj_stack.length - 1];
        last_level -= 1;
      }
      last_level = cur_level;

      const pos = line.indexOf(":");
      const key = pos != -1 ? line.substring(0, pos).trim() : null;
      const value = pos != -1 ? line.substring(pos + 1).trim() : null;

      if (key) {
        let child = {};
        cur_obj[key] = child;
        obj_stack.push(child);
        cur_obj = child;

        if (value) {
          cur_obj["value"] = value;
        }
      }
    });
  return root;
}

const args = process.argv.slice(2).join(" ");
const result = spawnSync(`inxi ${args} -y1 -c0`, {
  encoding: UTF8,
  shell: true,
});

if (result.status == EXIT_STATUS_SUCCESS) {
  const out = parseInxiOutput(result.stdout);
  process.stdout.write(JSON.stringify(out) + LF, UTF8);
} else {
  process.stdout.write(result.stdout || "", UTF8);
  process.stderr.write(result.stderr || "", UTF8);
}
process.exit(result.status);
