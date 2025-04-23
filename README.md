# jinxi

jinxi is a simple wrapper for inxi to create json output that can be parsed more easily than the original inxi output. The native inxi json output is heavily opinionated about the key format in use. This has its reasons ([see inxi webpage](https://smxi.org/docs/inxi-json-xml-output.htm)) and is totaly fine, but makes it hard to access values in simple (shell) scripts.

## comparison between inxi and jinxi

As an example challenge let's try to retrieve all available network device names.
The regular inxi output looks like this:

```bash
$> inxi --network

Network:
  Device-1: Intel Ethernet I226-V driver: igc
  Device-2: MEDIATEK MT7922 802.11ax PCI Express Wireless Network Adapter
    driver: mt7921e
```

### inxi

usage:
```bash
$> inxi --network --output json --output-file print | jq
```
```json
[
  {
    "000#1#0#Network": [
      {
        "002#1#2#driver": "igc",
        "001#1#1#Device": "Intel Ethernet I226-V"
      },
      {
        "001#1#1#Device": "MEDIATEK MT7922 802.11ax PCI Express Wireless Network Adapter",
        "002#1#2#driver": "mt7921e"
      }
    ]
  }
]
```
querying with `jq`:
```bash
$> inxi --network --info --output json --output-file print | jq -r '
    .[] | to_entries[] | select(.key | endswith("Network")).value |
    .[] | to_entries[] | select(.key | endswith("Device")).value'
```
```bash no-copy
Intel Ethernet I226-V
MEDIATEK MT7922 802.11ax PCI Express Wireless Network Adapter
```

### jinxi

usage:
```bash
$> jinxi --network | jq
```
```json no-copy
{
  "Network": {
    "Device-1": {
      "value": "Intel Ethernet I226-V",
      "driver": {
        "value": "igc"
      }
    },
    "Device-2": {
      "value": "MEDIATEK MT7922 802.11ax PCI Express Wireless Network Adapter",
      "driver": {
        "value": "mt7921e"
      }
    }
  }
}
```
querying with `jq`:
```bash
$> jinxi --network | jq -r '.Network.[].value'
```
```bash no-copy
Intel Ethernet I226-V
MEDIATEK MT7922 802.11ax PCI Express Wireless Network Adapter
```

## Installation

### Dependencies

required packages:
* inxi
* nodejs
* npm (only for building)

### Installation

```bash
$> npm run all && sudo npm run system-install
```

## Usage
As `jinxi` is only a wrapper, please refer to the original [inxi documentation](https://smxi.org/docs/inxi.htm).
