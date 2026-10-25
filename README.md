![WAK1300-Raw Injection Page](https://arg0wak.github.io/gist/images/WAK1300-Raw/S4VSSJ9SMFK9VFNY.webp)

**W.A.K.** (**W**ebKit **A**utomated **K**ernel) is a lightweight, modular, and automated WebKit/Kernel exploit host designed for PlayStation 4 firmware 13.00-13.52.

WAK1300-Raw focuses on refining the existing exploit workflow through extensive code refactoring and execution-path optimizations. The result is a faster, more responsive exploit host with a streamlined interface, improved code maintainability, and native PS4 User’s Guide integration for a more seamless launch experience.

Users can host the project on any standard static HTTP server or run it locally using tools like Five Server. For remote access without port forwarding, the local server can be tunneled via Cloudflare or NGROK.

## Features

- **Refactored and Stripped Core:** Removed redundant primitive payload and binloader functions for a leaner, more stable execution path. Added optional WebSocket support and configured all supported firmware ranges to use GoldHEN injection.
- **Rewritten Offset Structure:** Cleaned up and rewrote the offset definitions and organization for improved consistency, readability, and maintainability across firmware versions.
- **Server-Side Firmware Routing:** Updated the Exploit Host menu to automatically route connected devices to the appropriate firmware-specific host based on the detected system version.
- **Automated Workflow:** Orchestrated execution lifecycle designed for automated caching and triggering.
- **AppCache Support:** Full offline caching capability via cache.manifest for network-independent usage.
- **XMB Like Interface:** Clean, low-overhead dark terminal aesthetic built for console browser rendering.

### WebSocket Logging

Optional WebSocket logging can be enabled by setting `WS_MODE` to `true` and configuring `WS_HOST`. Log messages are sent as plain text after HTML tags are stripped.

## Directory Structure

        ├── assets/
        │   └── index.css           # Hardened stylesheet for legacy WebKit
        ├── binaries/
        │   ├── 1302.bin            # 13.02 AIO Fix Binary
        │   ├── 1350.bin            # 13.50 AIO Fix Binary
        │   └── 1352.bin            # 13.52 AIO Fix Binary
        ├── js/
        │   └── bundle.js           # Bundled exploit script (core, mem, jb, int64, helper, rpc worker)
        ├── payloads/
        │   └── goldhen.bin         # GoldHEN v2.4b18.12 Payload
        ├── cache.manifest          # Offline AppCache manifest
        ├── fiveserver.config.cjs   # Five Server local deployment configuration
        ├── index.html              # Main orchestrator interface
        └── README.md               # Project documentation

## Deployment and Usage

### PS4 User's Guide via Custom DNS (Recommended)

This method provides the most integrated and seamless experience. It routes the native PS4 User's Guide directly to the host while actively sinkholing Sony telemetry and update servers at the DNS level.

1. On your PS4, go to **Settings** > **Network** > **Set Up Internet Connection**.
2. Select your connection type (Wi-Fi or LAN Cable) and choose **Custom**.
3. Set **IP Address Settings** to **Automatic** and **DHCP Host Name** to **Do Not Specify**.
4. Set **DNS Settings** to **Manual**:
   - **Primary DNS:** `35.209.229.156`
   - **Secondary DNS:** `0.0.0.0` (or leave completely blank)
     > **Warning:** Never specify an external secondary DNS (such as `8.8.8.8` or `1.1.1.1`). An active secondary DNS can bypass the sinkhole if the primary query times out, exposing your console to official update servers.
5. Set **MTU Settings** to **Automatic** and **Proxy Server** to **Do Not Use**.
6. Navigate to **Settings** > **User's Guide / Helpful Info** > **User's Guide** to launch the exploit host.
7. After caching, go to **Settings** > **Network** and turn off your network connection.

---

### Standalone Web Browser (GitHub Pages)

If you prefer not to modify your network DNS settings, you can launch the host directly using the PS4 Internet Browser:

1. Open the **Internet Browser** on your PS4.
2. Navigate to: `http://arg0wak.github.io/WAK1300-Raw`
3. Add the page to your **Bookmarks** for quick access and allow the AppCache to complete for offline use.
4. **Critical Requirement:** Because this method does not utilize the custom DNS sinkhole, you **must run the Update Blocker payload** immediately from the tools grid to prevent accidental firmware upgrades.

> **Note:** For maximum stability, automatic telemetry blocking, and offline User's Guide support, **PS4 User's Guide via Custom DNS** is strongly recommended.

### Self-Hosted via Five Server & Cloudflare Tunnel

1.  Clone the repository to your local machine:

        git clone https://github.com/arg0WAK/WAK1300-Raw.git
        cd WAK1300-Raw

2.  Serve the directory using Five Server (default port: `65277`):

        npx five-server .

3.  Expose the local instance using Cloudflare Tunnel:

        cloudflared tunnel --url http://localhost:65277

4.  Open the generated `trycloudflare.com` URL in the PS4 browser.

### Direct Web or ESP Hosting

1.  Deploy the directory to any static HTTP web host, local server, or ESP8266/ESP32 board.
2.  Navigate to the hosted address using the PS4 browser.
3.  Allow the Application Cache (AppCache) to reach 100%.
4.  Once cached, close and reopen the browser; the exploit can now run entirely offline.

## Credits

- **Core Bug:** [SceneCollective](https://hackerone.com/playstation/hacktivity?type=team)
- **Exploit Chain:** [raw13g](https://github.com/raw13g/raw13g.github.io)
- **AIO Fix** [Al-Azif](https://github.com/al-azif)
- **GoldHEN:** [SiSTRo](https://github.com/SiSTR0)
- **Modular Architecture, Implementation & UI:** [arg0WAK](https://github.com/arg0WAK)

## Contributing

Contributions are welcome, provided they bring meaningful improvements to the project.

Pull requests are reviewed manually. Submissions that are low-effort, AI-generated without meaningful review, unrelated to the project's goals, or otherwise of insufficient quality may be rejected.

If you redistribute this project or publish a derivative work, comply with the GPL-3.0 license and preserve applicable copyright and license notices. Credit the original project and link to the upstream repository where reasonably possible.

By submitting a contribution, you agree that your contribution is provided under the project's GPL-3.0 license.
