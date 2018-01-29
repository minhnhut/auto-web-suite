var fs = require('fs');
var readline = require('readline');
const cp = require('child_process')

const rl = readline.createInterface({
    input: fs.createReadStream('test.script')
});

const JsGenerator = {
    content: "",
    init() {
        this.content = "";
        this.pushLine("const puppeteer = require('puppeteer');");
        this.pushLine("(async () => {");
        this.pushLine("const browser = await puppeteer.launch({headless: false});");
        this.pushLine("const page = await browser.newPage();");
    },
    parseCommand(commandLine) {
        var commandParts = commandLine.split(" ", 2);
        let commandName = commandParts[0];
        let commandArgs = [];
        if (commandParts[1]) {
            commandArgs = commandParts[1].split(" ");
        }
        switch (commandParts[0]) {
            case "OpenUrl":
            let url = commandArgs[0];
            this.pushLine("await page.goto("+url+");");
            break;
        }
    },
    pushLine(code) {
        this.content = this.content.concat(code + "\n");
    },
    end() {
        this.pushLine("await browser.close();")
        this.pushLine("})();");
    }
}

JsGenerator.init();

rl.on('line', (line) => {
    JsGenerator.parseCommand(line);
});

rl.on('close', () => {
    JsGenerator.end();
    fs.writeFile("output.js", JsGenerator.content, (err) => {
        if (err) {
            console.log(err);
        }
        cp.fork('output.js');
    });
});