/**
 * @author fuckatm
 * @origin 傻妞官方
 * @create_at 2023-07-15 22:19:01
 * @version v1.0.4
 * @title 一起活动吧
 * @description 💵自动生成一个采集群，质量不行，容易导致微信封号谨慎使用，价值3元的线报引擎免费用。
 * @class 返利类
 * @disable false
 * @on_start true
 * @public true
 * @icon https://pp.myapp.com/ma_icon/0/icon_53999813_1664941357/256
 */

let fanli = Bucket("fanli")

let max_id = fanli.yqhd8_id ?? 0

let chat_id = "70727090"
let chat_name = "一起活动吧"
let remark = "实时更新羊毛，撸友最爱"
let platform = "web"
let bot_id = "default"
const baseURL = "https://www.yqhd8.com";

const cheerio = require("cheerio");

while (running()) {
    const { resp } = request({
        url: baseURL,
        method: "get",
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; Redmi K30 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36"
        },
        dataType: "json",
    })
    if (resp.data) {
        const $ = cheerio.load(resp.data);
        const list = $(".li-li").map((_, item) => {
            return {
                id: $(item).find('a').attr('href').replace(/[^0-9]/g, ""),
                title: $(item).find('.today-tittle').text(),
                url: baseURL + $(item).find('a').attr('href'),
            }
        }).get().filter(Boolean);


        list.reverse().forEach(async e => {
            if (e.id > max_id && shijianchuo + 6000 > time.now().unix()) {
                const { adapter, _ } = getAdapter("web", "default")
                const message = {
                    chat_id,
                    user_id: "送喜官",
                    content: fmt.sprintf("%s\n%s", e.title, e.url),
                }
                adapter.receive(message)
                max_id = id
                fanli.yqhd8_id = id
            }
        })
    }
    time.sleep(6000)
}

function CreateGroup() {
    let group = {
        in: true,
        chat_id,
        chat_name,
        remark: remark,
        platform,
        enable: true,
        created_at: time.now().unix(),
        bots_id: [bot_id],
        allowed: [],
        prohibited: [],
    }
    Bucket("CarryGroups")[chat_id] = JSON.stringify(group)
}

CreateGroup()