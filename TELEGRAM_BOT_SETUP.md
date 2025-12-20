# TELEGRAM BOT SETUP GUIDE
## Clean Up Bros Admin Notifications

**Created:** December 21, 2025
**Purpose:** Real-time admin alerts for new quotes, bookings, and payments

---

## ⚡ WHY TELEGRAM?

✅ **Instant push notifications** (faster than email)
✅ **Free forever** (no SMS costs like Twilio)
✅ **Works on mobile & desktop** (iOS, Android, Mac, Windows, Web)
✅ **Rich formatting** (bold, links, emojis)
✅ **No account required** (just phone number)
✅ **Reliable delivery** (99.9% uptime)

**vs Email:** Telegram notifications arrive instantly, emails can be delayed or go to spam
**vs SMS:** Telegram is free, SMS costs $0.09 per message in Australia

---

## 📋 STEP-BY-STEP SETUP

### Step 1: Install Telegram

**On Mobile:**
- iOS: https://apps.apple.com/app/telegram-messenger/id686449807
- Android: https://play.google.com/store/apps/details?id=org.telegram.messenger

**On Desktop:**
- Mac: https://telegram.org/dl/macos
- Windows: https://telegram.org/dl/windows
- Web: https://web.telegram.org

**Sign up with your phone number** (if you don't have an account)

---

### Step 2: Create Your Bot

1. **Open Telegram** and search for **@BotFather**

2. **Start a chat** with BotFather and send:
   ```
   /newbot
   ```

3. **BotFather will ask for a name:**
   ```
   Clean Up Bros Admin Bot
   ```

4. **BotFather will ask for a username** (must end with `_bot`):
   ```
   cleanupbros_admin_bot
   ```
   *If taken, try:*
   - `cleanupbros_alerts_bot`
   - `cleanupbros_notify_bot`
   - `cleanupbros_sydney_bot`

5. **BotFather will reply with your bot token:**
   ```
   Done! Congratulations on your new bot. You will find it at t.me/cleanupbros_admin_bot.

   Use this token to access the HTTP API:
   123456789:ABCdefGHIjklMNOpqrsTUVwxyz1234567890
   ```

6. **⚠️ SAVE THIS TOKEN!** Copy it immediately and save it securely.
   ```
   TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz1234567890
   ```

---

### Step 3: Get Your Chat ID

Your bot needs to know WHERE to send messages. That's your Chat ID.

1. **Search for your bot** in Telegram:
   - Type `@cleanupbros_admin_bot` in the search
   - OR go to `t.me/cleanupbros_admin_bot`

2. **Send a message to your bot:**
   ```
   /start
   ```

3. **Get your Chat ID** (2 methods):

   **Method A: Use @userinfobot (Easiest)**
   - Search for `@userinfobot` on Telegram
   - Start chat and send `/start`
   - It will reply with your Chat ID
   - Example: `Your user ID is: 123456789`

   **Method B: API Request**
   - Replace `<YOUR_BOT_TOKEN>` with your actual token
   - Open this URL in your browser:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
   - You'll see JSON response like:
   ```json
   {
     "ok": true,
     "result": [
       {
         "update_id": 123456,
         "message": {
           "message_id": 1,
           "from": {
             "id": 987654321,  ← THIS IS YOUR CHAT ID
             "is_bot": false,
             "first_name": "Your Name",
             ...
           },
           "chat": {
             "id": 987654321,  ← OR THIS ONE
             ...
           }
         }
       }
     ]
   }
   ```
   - Copy the number from `"from":{"id":...}` or `"chat":{"id":...}`

4. **Save your Chat ID:**
   ```
   TELEGRAM_ADMIN_CHAT_ID=987654321
   ```

---

### Step 4: Test Your Bot

**Quick Test with cURL:**

Replace `<BOT_TOKEN>` and `<CHAT_ID>` with your values:

```bash
curl -X POST \
  "https://api.telegram.org/bot<BOT_TOKEN>/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "<CHAT_ID>",
    "text": "🎉 Clean Up Bros Bot is working!",
    "parse_mode": "HTML"
  }'
```

**Example:**
```bash
curl -X POST \
  "https://api.telegram.org/bot123456:ABC-DEF.../sendMessage" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "987654321",
    "text": "🎉 Clean Up Bros Bot is working!",
    "parse_mode": "HTML"
  }'
```

**You should receive a message on Telegram immediately!** ✅

---

### Step 5: Add Bot to n8n Workflow

1. **Open your n8n instance:** https://nioctibinu.online

2. **Open your existing workflow** (or create new one)

3. **Add Telegram node:**
   - Click "+" to add new node
   - Search for "Telegram"
   - Select "Telegram" node
   - Choose "Send Message"

4. **Configure credentials:**
   - Click "Create New Credential"
   - Name: "Clean Up Bros Telegram Bot"
   - Bot Token: `123456789:ABC...` (your token from Step 2)
   - Click "Save"

5. **Configure message:**
   - Chat ID: `987654321` (your chat ID from Step 3)
   - Text: Use template below
   - Parse Mode: HTML or Markdown

---

## 📱 MESSAGE TEMPLATES

### Template 1: New Quote Alert

```html
🚨 <b>NEW QUOTE REQUEST</b>

👤 <b>Customer:</b> {{$json["customerName"]}}
📞 <b>Phone:</b> <a href="tel:{{$json["customerPhone"]}}">{{$json["customerPhone"]}}</a>
✉️ <b>Email:</b> {{$json["customerEmail"]}}

🏠 <b>Service:</b> {{$json["serviceType"]}}
📍 <b>Suburb:</b> {{$json["suburb"]}}
💰 <b>Est. Price:</b> ${{$json["estimatedPrice"]}}
⭐ <b>Lead Score:</b> {{$json["leadScore"]}}/100

📋 <b>Ref:</b> {{$json["referenceId"]}}

👉 <b>ACTION: Call customer within 2 hours!</b>

<a href="https://cleanupbros.com.au/AdminDashboard">View in Dashboard</a>
```

**How it looks:**

```
🚨 NEW QUOTE REQUEST

👤 Customer: Sarah Johnson
📞 Phone: 0412 345 678
✉️ Email: sarah@email.com

🏠 Service: Residential Cleaning
📍 Suburb: Liverpool
💰 Est. Price: $180
⭐ Lead Score: 85/100

📋 Ref: RES-2025-001

👉 ACTION: Call customer within 2 hours!

View in Dashboard
```

---

### Template 2: Payment Received

```html
💰 <b>PAYMENT RECEIVED</b>

✅ Customer <b>{{$json["customerName"]}}</b> has paid!

💳 <b>Amount:</b> ${{$json["amount"]}} AUD
📋 <b>Ref:</b> {{$json["referenceId"]}}
🏠 <b>Service:</b> {{$json["serviceType"]}}
📅 <b>Scheduled:</b> {{$json["scheduledDate"]}}

🎯 <b>Next Step:</b> Add to calendar and send team schedule

<a href="https://cleanupbros.com.au/AdminDashboard">View Booking</a>
```

---

### Template 3: Booking Confirmed by Admin

```html
✅ <b>BOOKING CONFIRMED</b>

Payment link sent to: <b>{{$json["customerName"]}}</b>

💸 <b>Payment Link:</b>
{{$json["paymentLink"]}}

✉️ Email sent with payment instructions
📞 Awaiting customer payment

<a href="{{$json["paymentLink"]}}">View Payment Link</a>
```

---

### Template 4: Daily Summary (Optional)

```html
📊 <b>DAILY SUMMARY</b>
{{$json["date"]}}

📋 <b>New Quotes:</b> {{$json["newQuotes"]}}
💰 <b>Payments Received:</b> ${{$json["totalPayments"]}}
✅ <b>Bookings Confirmed:</b> {{$json["confirmedBookings"]}}
🔥 <b>Hot Leads:</b> {{$json["hotLeads"]}}

<a href="https://cleanupbros.com.au/AdminDashboard">Open Dashboard</a>
```

---

## 🎨 FORMATTING TIPS

Telegram supports **HTML** and **Markdown** formatting:

### HTML Format (Recommended):
```html
<b>Bold text</b>
<i>Italic text</i>
<u>Underline</u>
<s>Strikethrough</s>
<a href="https://url.com">Link text</a>
<code>Monospace code</code>
```

### Markdown Format:
```markdown
*Bold text*
_Italic text_
[Link text](https://url.com)
`Monospace code`
```

### Emojis (Copy & Paste):
```
🚨 Alert
📞 Phone
✉️ Email
🏠 House
💰 Money
⭐ Star
📋 Document
👤 Person
📍 Location
✅ Checkmark
❌ Cross
🔥 Fire (hot lead)
📊 Chart
💳 Card
📅 Calendar
🎯 Target
```

---

## 🔐 SECURITY BEST PRACTICES

1. **Never share your bot token publicly**
   - Don't commit to Git
   - Don't paste in public Slack/Discord
   - Don't screenshot and share

2. **Keep Chat ID private**
   - Only you (admin) should have access
   - Don't let customers message your admin bot

3. **Set bot privacy mode** (optional)
   - Send `/setprivacy` to @BotFather
   - Choose your bot
   - Choose "Disable" to prevent bot from seeing all messages in groups

4. **Restrict bot commands** (optional)
   - Send `/setcommands` to @BotFather
   - Set allowed commands:
   ```
   start - Start the bot
   help - Get help
   status - Check bot status
   ```

---

## 🛠️ TROUBLESHOOTING

### ❌ "Unauthorized" error
**Problem:** Bot token is invalid
**Solution:** Copy token again from @BotFather, make sure no extra spaces

### ❌ "Chat not found" error
**Problem:** Wrong Chat ID or bot wasn't started
**Solution:**
1. Message your bot with `/start` first
2. Get Chat ID again using @userinfobot

### ❌ Messages not arriving
**Problem:** Telegram notifications disabled
**Solution:**
1. Open Telegram settings
2. Notifications & Sounds
3. Enable notifications for your bot

### ❌ "Bot was blocked by the user"
**Problem:** You blocked the bot accidentally
**Solution:**
1. Search for your bot
2. Click "Unblock" or "Restart"
3. Send `/start`

---

## 🔗 n8n WORKFLOW INTEGRATION

### Full Workflow Example:

```
1. Webhook (Quote Received)
   ↓
2. Telegram Node (Alert Admin)
   - Chat ID: Your chat ID
   - Message: New quote template
   ↓
3. Resend Email Node (Welcome Customer)
   ↓
4. Save to Supabase
```

### n8n Telegram Node Settings:

**Node Configuration:**
- **Resource:** Message
- **Operation:** Send Message
- **Chat ID:** `{{987654321}}` (your chat ID)
- **Text:** (use templates above)
- **Additional Fields:**
  - Parse Mode: `HTML`
  - Disable Web Page Preview: `true` (cleaner messages)
  - Disable Notification: `false` (want alerts!)

**Expression for Dynamic Content:**
```javascript
// Access form data
{{$json["customerName"]}}
{{$json["customerPhone"]}}
{{$json["serviceType"]}}

// Format price
${{Math.round($json["estimatedPrice"])}}

// Format date
{{new Date($json["createdAt"]).toLocaleDateString()}}
```

---

## 📈 ADVANCED FEATURES (Optional)

### 1. **Inline Buttons**

Add action buttons to messages:

```json
{
  "chat_id": "987654321",
  "text": "🚨 New Quote - John Smith\n$180 - Residential",
  "reply_markup": {
    "inline_keyboard": [
      [
        {"text": "📞 Call", "url": "tel:0412345678"},
        {"text": "📊 Dashboard", "url": "https://cleanupbros.com.au/AdminDashboard"}
      ],
      [
        {"text": "✅ Confirm", "callback_data": "confirm_RES-001"},
        {"text": "❌ Reject", "callback_data": "reject_RES-001"}
      ]
    ]
  }
}
```

### 2. **Multiple Admins**

Send to multiple people:

**Option A: Group Chat**
1. Create Telegram group: "Clean Up Bros Team"
2. Add all admins
3. Add your bot to the group
4. Get group Chat ID (negative number)
5. Send messages to group

**Option B: Loop in n8n**
1. Store multiple chat IDs
2. Use n8n "Split In Batches" node
3. Send same message to each admin

### 3. **Two-Way Commands**

Let admins reply to bot:

1. Set up webhook in n8n to receive updates
2. Parse incoming messages
3. Trigger actions based on commands:
   - `/stats` - Show daily stats
   - `/pending` - List pending quotes
   - `/today` - Today's schedule

---

## ✅ CHECKLIST

Before going live, make sure:

- [ ] Bot created via @BotFather
- [ ] Bot token saved securely
- [ ] Chat ID obtained
- [ ] Test message sent successfully
- [ ] Bot added to n8n workflow
- [ ] Message templates customized
- [ ] Telegram notifications enabled on phone
- [ ] Bot token added to `.gitignore` or environment variables
- [ ] Multiple admins added (if needed)

---

## 🎯 WHAT'S NEXT?

After Telegram is working:

1. **Add to all n8n workflows:**
   - Quote submission → Telegram alert
   - Payment received → Telegram confirmation
   - Booking confirmed → Telegram update

2. **Combine with Twilio SMS** (for backup):
   - Use Telegram as primary notification
   - Use Twilio SMS if Telegram fails (rare)

3. **Set up daily summaries:**
   - Schedule n8n cron job
   - Send daily stats at 6 PM
   - Include: new quotes, payments, bookings

---

## 💡 PRO TIPS

1. **Use emojis generously** - Makes messages scannable
2. **Keep messages short** - Key info only, details in dashboard
3. **Include action links** - Phone numbers, dashboard links
4. **Test before going live** - Send fake quotes to verify
5. **Mute non-urgent bots** - So you only get important alerts

---

## 📚 RESOURCES

- Telegram Bot API Docs: https://core.telegram.org/bots/api
- @BotFather: https://t.me/botfather
- @userinfobot: https://t.me/userinfobot
- n8n Telegram Node Docs: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.telegram/

---

**Need Help?**
Test your bot by sending `/start` and make sure you see a response!

**Cost:** 🎉 **FREE FOREVER** - No monthly fees, no per-message costs!

---

**Created by:** Claude Code
**For:** Clean Up Bros Production Backend
**Date:** December 21, 2025
