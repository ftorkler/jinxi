import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseInxiOutput } from "./inxi_parser.js";

describe("inxi_parser", () => {
  it("should parse a simple oneline key value pair", () => {
    const result = parseInxiOutput("key:value");
    assert.strictEqual(result, '{"key":{"value":"value"}}');
  });

  it("should parse a complex inxi example structure", () => {
    const givenInput = `
Network:
  Device-1: Intel Ethernet I226-V
    driver: igc
    IF: eno1
      state: up
      speed: 1000 Mbps
      duplex: full
      mac: aa:bb:cc:dd:ee:ff
  Device-2: MEDIATEK MT7922 802.11ax PCI Express Wireless Network Adapter
    driver: mt7921e
    IF: wlp7s0
      state: down
      mac: 00:11:22:33:44:55

Info:
  Memory:
    total: 60 GiB
      note: est.
    available: 60.46 GiB
    used: 22.48 GiB (37.2%)
  Processes: 123
  Uptime: 99d 6h 33m
  Shell: Zsh
  inxi: 3.3.38`;

    const result = parseInxiOutput(givenInput);
    assert.strictEqual(
      result,
      '{"Network":{"Device-1":{"value":"Intel Ethernet I226-V","driver":{"value":"igc"},"IF":{"value":"eno1","state":{"value":"up"},"speed":{"value":"1000 Mbps"},"duplex":{"value":"full"},"mac":{"value":"aa:bb:cc:dd:ee:ff"}}},"Device-2":{"value":"MEDIATEK MT7922 802.11ax PCI Express Wireless Network Adapter","driver":{"value":"mt7921e"},"IF":{"value":"wlp7s0","state":{"value":"down"},"mac":{"value":"00:11:22:33:44:55"}}}},"Info":{"Memory":{"total":{"value":"60 GiB","note":{"value":"est."}},"available":{"value":"60.46 GiB"},"used":{"value":"22.48 GiB (37.2%)"}},"Processes":{"value":"123"},"Uptime":{"value":"99d 6h 33m"},"Shell":{"value":"Zsh"},"inxi":{"value":"3.3.38"}}}',
    );
  });
});
