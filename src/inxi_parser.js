export function parseInxiOutput(inxiOutput) {
  String.prototype.indentation = function () {
    for (let i = 0; i < this.length; ++i) {
      if (this[i] !== " ") return i;
    }
    return -1;
  };

  const root = {};
  const obj_stack = [root];
  let cur_obj = root;
  let last_level = -1;

  inxiOutput.split("\n").forEach((line) => {
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
  return JSON.stringify(root);
}
