import express from 'express'
import dotenv from 'dotenv'
import TelegramBot from "node-telegram-bot-api";
import keyboards from "./keyboard/keyboards.js";
import { read, write } from "./utils/FS.js";

dotenv.config()
const app = express()
app.use(express.json())
const bot = new TelegramBot(process.env.TOKEN, {
    polling:true
})


bot.onText(/\/start/, msg => {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, `Assalomu aleykum, ${msg.from.first_name} ${msg.from.last_name}!`, {
        reply_markup: {
            keyboard: keyboards.menu,
            resize_keyboard: true
        }
    })
})

bot.on('message', msg => {
    const chatId = msg.chat.id

    if(msg.text == 'Biz haqimizda 🕵🏻‍♂️') {
        bot.sendPhoto(chatId, 'https://i.pinimg.com/474x/b1/79/db/b179dbae00079dac49067e528b3872f7--inside-out-sadness.jpg', {
            caption: `<b><i>Ming bor Uzur ${msg.from.first_name}, Bu sir!</i></b>`,
            parse_mode:"HTML"
        })
    }

    if(msg.text == 'Bizning manzillarimiz! 🗺') {
        bot.sendPhoto(chatId, 'https://www.indiewire.com/wp-content/uploads/2015/06/sadness-inside-out.jpg',{
            caption: `<b>Ming bor uzur ${msg.from.first_name}, Hozirda arenda qimmat bo'lganligi sababli joylarimz yopilib ketgan faqatgina online xizmatimiz mavjud holos!</b>`,
            parse_mode:"HTML"
        })
    }

    if( msg.text == 'Bizning Taomnomamiz! 📜') {
        bot.sendMessage(chatId, 'Marhamat 💁‍♂️ Bizning taomnomamiz bilan tanishing va buyurtma bering!', {
            reply_markup: {
                keyboard: keyboards.meals,
                resize_keyboard:true
            }
        })
    }
    if(msg.text == 'Asosiy menyu 🎯') {
        bot.sendMessage(chatId, 'Asosiy menyular', {
            reply_markup: {
                keyboard: keyboards.menu,
                resize_keyboard:true
            }
        })
    }
})


bot.on('message', msg => {
    const chatId = msg.chat.id

    const foundMeals = read('meals.json').find(e => e.name == msg.text)
    if(foundMeals) {
        bot.sendPhoto(chatId, `${foundMeals.photo}`,{
            caption:`<b>Taom nomi</b>:  <i>${foundMeals.description}</i>\n<b>Narxi:  </b><i>${foundMeals.price} so'm</i>`,
            parse_mode:"HTML",
            reply_markup: {
                inline_keyboard:[
                    [
                        {
                            text:"Buyurtma berish",
                            callback_data: foundMeals.name
                        }
                    ]
                ]
            }
        })
    }
})

bot.on('callback_query', async msg =>{
    const chatId = msg.message.chat.id
        if(msg.data) {
            const userContact = await bot.sendMessage(chatId, 'Telefon raqam ulashish', {
                reply_markup: JSON.stringify({
                    keyboard: [
                        [
                            {
                                text:"Telefon raqam ulashish",
                                request_contact: true
                            }
                        ]
                    ],
                    resize_keyboard:true,
                    one_time_keyboard:true
                })
            })
            bot.onReplyToMessage(userContact.chat.id, userContact.message_id, async contactMsg => {
                const allRequests = read('requests.json')
                allRequests.push({
                    id:allRequests.at(-1)?.id +1 || 1,
                    meal:msg.data,
                    name:contactMsg.from.first_name,
                    contact: contactMsg.contact.phone_number
                })

                const newRequest = await write('requests.json', allRequests)

                if(newRequest) {
                    bot.sendMessage(chatId, "Buyurtmanggiz qabul qilindi! Tez orada siz bilan bog'lanishadi!", {
                        reply_markup: {
                            keyboard: keyboards.menu,
                            resize_keyboard:true
                        }
                    })
                }
            })
        }
})


app.get('/meals', (req, res) => {
    res.json(read('meals.json'))
})
app.post('/newMeals', async(req, res) => {
    const { name, price, description, photo } = req.body

    const allMeals = read('meals.json')

    allMeals.push({
        id: allMeals.at(-1)?.id +1 || 1,
        name,
        price,
        description,
        photo
    })

    await write('meals.json', allMeals)
    res.json("Ok")
})
app.listen(process.env.PORT?? 9494, console.log(process.env.PORT?? 9494))