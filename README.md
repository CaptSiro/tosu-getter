# tosu-getter

Overlay with server code to get the currently playing beatmap audio and background

# tosu-Getter Installation Guide

This will take a while...

### 1. Install a Local PHP Server

- **PHP 7.3+ required** (PHP 8.0+ recommended).
- Recommended: [WampServer](http://wampserver.aviatechno.net/?lang=en)  
  Download it under **"Installers Wampserver full install version"**.
- Run the installer. If prompted, install any missing **Visual C++ Redistributables**.
- If you encounter issues, search YouTube for **"how to install WampServer"**.

---

### 2. Set Up the Project Directory

- Start WampServer.
- Navigate to its web root directory:  
  Usually `C:\wamp\www`
- Create a new folder:  
  `C:\wamp\www\tosu-getter`

---

### 3. Download tosu-Getter

- Download the latest **tosu-getter** `.zip`.
- Extract all contents into `C:\wamp\www\tosu-getter`.
- Verify installation by visiting:  
  [http://localhost/tosu-getter](http://localhost/tosu-getter)  
  You should see a confirmation message.
- Open the extracted `paths.php` file in a text editor. In File Explorer, navigate to the target directory. Click inside 
  the address bar and copy the full path. Replace the placeholder path in `paths.php` with the copied one. Make sure 
  it's inside **quotes**. It’s recommended (but not strictly required) to **escape backslashes** by doubling them: 
  Change `\` to `\\` (e.g., `"C:\\wamp\\www\\tosu-getter"`).

---

### 4. Enable the Overlay in tosu

- Inside `tosu-getter`, find the `tosu-overlay` directory.
- Move or copy **the entire `tosu-overlay` folder** into tosu’s `static` directory:  
  Example: `path\to\tosu\static\tosu-overlay`
- This adds the overlay to the tosu web interface.

---

### 5. Use the Overlay

- The overlay buttons are not clickable from within tosu.
- Instead, copy the overlay's URL (displayed below it) and open it directly in your browser.

---

### Final Notes

- **tosu and your PHP server must both be running** for the overlay to work.
- You can configure WampServer to launch on system startup (not covered here).

*(cleaned-up version of installation guide by ChatGPT)*
