import {Telegraf} from "telegraf";
import sqlite3 from 'sqlite3';

const bot = new Telegraf('1900336365:AAGEkQjLI7z_jqs2E4IM8prXCGG9Mr2MhN4');

// Object to store the number of messages sent by each user in a group on a particular day
const messageCount = {};

// Flag to keep track of whether the message limit is currently enabled or disabled
let messageLimitEnabled = true;
let numberLimit = 4;

let language = "Persian";

bot.help(async (ctx) => {
    const member = await ctx.telegram.getChatMember(ctx.message.chat.id, ctx.message.from.id);
    if (ctx.message.chat.id === -1001779523903) {
        if (member.status === 'creator' || member.status === 'administrator') {
            await ctx.reply([".                      توانایکانی ڕۆبات",
"                        قابلیت های ربات",
,
"✅️ : ئەم ڕۆبۆتە پشتگیری دوو زمانی کوردی و فارسی دەکات",
"☑️:ربات دو زبان کردی و فارسی را پشتیابنی می کند",
,
"🟢 کوردی",
"🔴 فارسی",
,
"🟢 بۆ دانانی ژمارەی گماڕۆ کردنی نامەکان لە کۆر دا تایپ بکەن -> `ژمارە` X ئەم ایکس دەتوانێ هەر چەندێک بێت بۆ نمونە: `ژمارە` 4،",
"**سەرنج بدەن:** ژمارەی نوسراوە دەبێت ئینگلیزی بێت",
,
"🔴 برای تعین مقدار اجازه ی پیام تایپ کند -> `تعداد` X ایکس میتواند هر مقداری باشی برای مثال: `تعداد` 4،",
"**توجه:** باید با رقم انگلیسی تعداد را وارد کنید",
,
,
"🟢 بۆ دیتنی ژمارەی دیاری کراوی گماڕۆی نامه تایپ بکەن -> `ژمارەی گماڕۆکان`",
,
"🔴 برای دیدن مقدار محدودیت در ارسال پیام تایپ کنید -> `تعداد محدودیت`",
,
"🟢 بۆ گۆڕینی زمان بۆ فارسی تایپ بکەن -> `زبان فارسی`",
,
"🔴 برای تغییر زبان به کوردی تایپ کنید -> ",
"`زمانی کوردی`",
,
"🟢 بۆ لەکارخستنی گماڕۆ پیویستە بنووسرێت -> `هەڵگیرانی گماڕۆکان` ",
,
"🔴 برای لغو محدودیت پیام بنویسید -> `لغو محدودیت`",
,
"🟢 بۆ دانانەوەی دووبارەی گماڕۆکان پیویستە بنووسرێت -> `دانانی گماڕۆکان`",
,
"🔴 برای فعال شدن دوباره محدودیت پیام بنویسید -> `محدودیت`",
,
"🟢 بۆ رۆیشتنی گماڕۆی نامە و میدیا لە سەر کەسێکی تایبەت ->1: ریپلای لەسەر نوسراوەکەی بکەن و بنووسرێت 《 `لاچونی گماڕۆ` 》، 2: بنووسرێت -> لاچونی گماڕۆ وە چت ئیدی بەکارهێنەر بۆ نمونە: `لاچونی گماڕۆ` 4884248422",
,
"🔴 برای ریست محدودیت ها بر روی یک شخص -> 1: روی پیام آن نفر ریپلای کنید 《 `حذف محدودیت` 》، 2: بنویسید -> حذف محدودیت و چت ایدی شخص برای مثال: `حذف محدودیت` 4884248422",
,
"🟢 بۆ دیتنی چەت ئایدی خوێندکارەکان بنووسرێت -> `هەموو ئایدی کان`",
,
"🔴 برای نمایش چت ایدی دانشجوها بنویسید -> `کل ایدی`",
,
,
"Powered 𝑏𝑦 [𝑀𝑎𝑡𝑖𝑛](tg://user?id=498133361) 𝑤𝑖𝑡ℎ [𝑁𝑜𝑑𝑒 𝑗𝑠](https://nodejs.org)"].join("\n"), {parse_mode: "Markdown", disable_web_page_preview: true });
        }
    }
});

// Middleware to check if a user has sent more than 8 messages in a group on the same day
bot.on('message', async (ctx) => {
    const chatId = ctx.message.chat.id;
    const userId = ctx.message.from.id;
    const member = await ctx.telegram.getChatMember(chatId, userId);

    // Get the current date
    const now = new Date();
    const options = { timeZone: 'Asia/Tehran' };

    const year = parseInt(now.toLocaleString('en-US', { ...options, year: 'numeric' }));
    const month = String(now.toLocaleString('en-US', { ...options, month: '2-digit' })).padStart(2, '0');
    const day = String(now.toLocaleString('en-US', { ...options, day: '2-digit' })).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    let db = new sqlite3.Database('users.db', (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    // Create the users table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      chatId INTEGER
    )`, (err) => {
        if (err) {
            console.error(err.message);
        }
    });
    const userName = member.user.first_name;
    const userChatId = member.user.id;

    db.get(`SELECT * FROM users WHERE chatId = ?`, [userChatId], (err, row) => {
        if (err) {
            console.error(err.message);
        } else if (row) {

        } else {
            db.run(`INSERT INTO users(name, chatId) VALUES(?, ?)`, [userName, userChatId], (err) => {
                if (err) {
                    console.error(err.message);
                }
            });
        }
    });

    // Close the database
    // db.close((err) => {
    //     if (err) {
    //         console.error(err.message);
    //     }
    //     console.log('Closed the users database connection.');
    // });

    if (ctx.message.chat.id === -1001779523903) {

        if (!messageCount[chatId]) {
            messageCount[chatId] = {};
        }

        if (!messageCount[chatId][today]) {
            messageCount[chatId][today] = {};
        }

        if (!messageCount[chatId][today][userId]) {
            messageCount[chatId][today][userId] = 1;
        } else {
            messageCount[chatId][today][userId]++;
        }

        // Check if the user is the group owner or an administrator
        if (member.status === 'creator' || member.status === 'administrator') {
            if (ctx.message.text === "ژمارەی گماڕۆکان" || ctx.message.textAlign === "تعداد محدودیت") {
                if (language === "Kurdish") {
                    ctx.reply(numberLimit);
                } else if (language === "Persian") {
                    ctx.reply(numberLimit);
                }
            }
            if (ctx.message.text.slice(0, 5) === "تعداد" || ctx.message.text.slice(0, 5) === "ژمارە") {
                try {
                    numberLimit = ctx.message.text.match((/\d+/))[0];
                } catch (e) {
                    if (e instanceof TypeError) {
                        numberLimit = 4;
                    }
                }
            }
            if (ctx.message.text === "زمانی کوردی") {
                language = "Kurdish";
                await ctx.reply("زمانی ڕۆبۆتەکە گۆڕدرا بۆ کوردی");
            } else if (ctx.message.text === "زبان فارسی") {
                language = "Persian";
                await ctx.reply("زبان ربات به فارسی تغییر کرد");
            }
            if (ctx.message.text === "کل ایدی" || ctx.message.text === "هەموو ئایدی کان") {
                db.all(`SELECT * FROM users`, [], (err, rows) => {
                    if (err) {
                        console.error(err.message);
                    }
                    if (language === "Kurdish"){
                        // const usersInfo = rows.map(row => `ناو: [${row.name}](tg://user?id=${row.chatId}) و چەت ئایدی: ${row.chatId}`);
                        const usersInfo = rows.map(row => `ناو:${row.name} و چەت ئایدی: ${row.chatId}`);
                        // ctx.reply(usersInfo.join('\n'), {parse_mode: "Markdown"});
                        ctx.reply(usersInfo.join('\n'));
                    }
                    else if ( language === "Persian"){
                        const usersInfo = rows.map(row => `نام: ${row.name}${row.chatId} و چت ایدی: ${row.chatId}`);
                        ctx.reply(usersInfo.join('\n'));
                    }
                });
            }
        }

        // Check if the message limit is currently enabled
        else if (!messageLimitEnabled) {
            return;
        }

        if (messageCount[chatId][today][userId] >= numberLimit && member.status !== 'creator' && member.status !== 'administrator') {
            // Remove the user's permissions to send messages in the chat
            let endOfDay = new Date(year, now.getMonth(), now.getDate() + 1);
            await ctx.telegram.restrictChatMember(chatId, userId, {
                can_send_messages: false,
                can_send_media_messages: false,
                can_send_polls: false,
                can_send_other_messages: false,
                can_invite_users: false,
                until_date: Math.floor(endOfDay.getTime() / 1000) // Set until_date to end of current day
            });

            // Create Date objects for now and tomorrow in 'Asia/Tehran' timezone
            let nowTehran = new Date(now.toLocaleString('en-US', {timeZone: 'Asia/Tehran'}));
            let toMorrowTehran = new Date(endOfDay.toLocaleString('en-US', {timeZone: 'Asia/Tehran'}));

            // Calculate time difference in 'Asia/Tehran' timezone
            let timeDiffTehran = toMorrowTehran.getTime() - nowTehran.getTime();

            // Convert milliseconds to hours, minutes, and seconds
            let hours = Math.floor(timeDiffTehran / (1000 * 60 * 60));
            let minutes = Math.floor((timeDiffTehran % (1000 * 60 * 60)) / (1000 * 60)) + 1;
            // let seconds = Math.floor((timeDiffTehran % (1000 * 60)) / 1000);

            // console.log(`Time remaining until tomorrow: ${hours} hours, ${minutes} minutes`);
            const remainingTime = `${hours}:${minutes.toString().length > 1 ? minutes : `0${minutes}`}`;

            if (language === "Kurdish") {
                await ctx.telegram.sendMessage(chatId, `خوێندکاری ئازیز [${member.user.first_name}](tg://user?id=${member.user.id}) تۆ ئەمڕۆ [${numberLimit}](tg://setting) نامەی خۆت ناردووە. وە بۆ ماوەی __${remainingTime}__ لە ناردنی نامە لەم کۆرە، قەدەغە دەکرێیت.`, {parse_mode: "Markdown"});
            } else if (language === "Persian") {
                await ctx.telegram.sendMessage(chatId, `دانشجوی گرامی [${member.user.first_name}](tg://user?id=${member.user.id}) شما امروز مقدار [${numberLimit}](tg://setting) پیام خود را در گروه ارسال کرده اید. و به مدت __${remainingTime}__ از فرستادن پیام در گروه محدود میگردید.`, {parse_mode: "Markdown"});
            }
        }

        // Check if the user is the group owner or an administrator
        if (member.status === 'creator' || member.status === 'administrator') {
            const text = ctx.message.text.trim().toLowerCase();
            if (text === 'محدودیت' || text === "دانانی گماڕۆکان") {
                messageLimitEnabled = true;
                if (language === "Kurdish") {
                    await ctx.telegram.sendMessage(chatId, 'سنووری ناردنی نامە چالاک دەکرێت');
                } else if (language === "Persian") {
                    await ctx.telegram.sendMessage(chatId, 'محدودیت در ارسال پیام فعال شد.');
                }
            } else if (text === 'لغو محدودیت' || text === "هەڵگیرانی گماڕۆکان") {
                if (language === "Kurdish") {
                    await ctx.telegram.sendMessage(chatId, 'سنووردارکردنی ناردنی نامە و میدیا هەڵگیرا');
                } else if (language === "Persian") {
                    messageLimitEnabled = false;
                    await ctx.telegram.sendMessage(chatId, 'محدودیت در ارسال پیام غیر فعال شد.');
                }

            }
        }
        // Check if the message is a reply to a previous message
        if (ctx.message.reply_to_message) {
            const replyText = ctx.message.text;

            // Check if the reply text is "حذف محدودیت"
            if (replyText === 'حذف محدودیت' && ctx.message.reply_to_message || replyText === 'لاچونی گماڕۆ' && ctx.message.reply_to_message) {
                // Get information about the user who sent the message
                // Check if the user is an admin or creator of the group
                if (member.status === 'creator' || member.status === 'administrator') {
                    // Remove any restrictions placed on the user
                    await ctx.telegram.restrictChatMember(chatId, ctx.message.reply_to_message.from.id, {
                        can_send_messages: true,
                        can_send_media_messages: true,
                        can_send_polls: true,
                        can_send_other_messages: true,
                        can_invite_users: true,
                    });
                    // Send a confirmation message
                    if (language === "Kurdish") {
                        await ctx.reply(`هەموو دەستگەیشتنەکان بۆ [${member.user.first_name}](tg://user?id=${ctx.message.reply_to_message.from.id}) گەڕاونەتەوە باری ئاسایی خۆیان`, {parse_mode: "Markdown"});
                    } else if (language === "Persian") {
                        await ctx.reply(`تمامی دسترسی ها برای [${member.user.first_name}](tg://user?id=${ctx.message.reply_to_message.from.id}) به حالت عادی بازکشت`, {parse_mode: "Markdown"});
                    }
                }
            }
        } else if (member.status === 'creator' || member.status === 'administrator') {
            if (ctx.message.text.replace(/\d+/g, '').trim() === "حذف محدودیت" || ctx.message.text.replace(/\d+/g, '').trim() === "لاچونی گماڕۆ") {
                await ctx.telegram.restrictChatMember(chatId, ctx.message.text.match((/\d+/))[0], {
                    can_send_messages: true,
                    can_send_media_messages: true,
                    can_send_polls: true,
                    can_send_other_messages: true,
                    can_invite_users: true,
                });

                if (language === "Kurdish") {
                    await ctx.reply(`هەموو گماڕۆکان بۆ [${member.user.first_name}](tg://user?id=${ctx.message.text.match((/\d+/))[0]}) لابردران.`, {parse_mode: "Markdown"});
                } else if (language === "Persian") {
                    await ctx.reply(`محدودیت ها برای [${member.user.first_name}](tg://user?id=${ctx.message.text.match((/\d+/))[0]}) برداشته شدند`, {parse_mode: "Markdown"});
                }
            }
        }
    } else if (ctx.message.text === "/start" && ctx.message.chat.type === "private") {
        await ctx.telegram.sendMessage(chatId, "This bot was created for ostad\nkhzri group and can't do anything more!\n" +
            "\nif you want u can contact to developer :) \n\n" +
            "Developer Instagram: https://www.instagram.com/matindevilish_boy")
    }

});

// Start the bot
bot.launch();
