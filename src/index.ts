const envPath = "./.env";

require("dotenv").config({ path: envPath });
import puppeteer, { Page } from "puppeteer";
import { setCredentials, CredentialsDiscord } from "./credentials";
import clickButton from "./button";
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

type InfoType = {
  level: string;
  message: string;
  timestamp: string;
};

type BrowserSettingType = {
  args?: Array<string>;
  executablePath?: string;
  userDataDir?: string;
  ignoreDefaultArgs?: Array<string>;
  headless?: boolean;
  slowMo?: number;
};

const myFormat = printf(({ level, message, timestamp }: InfoType) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(label({ message: true }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "result.log" }),
  ],
});

const hasAlreadyLoggedInDiscord = async (page: Page) => {
  await page.goto("https://discord.com/login");

  const discordLoginButton = await page.$("button[type=submit]");
  return (discordLoginButton === null ? true : false) as boolean;
};

const loginDiscord = async (page: Page, credDiscord: CredentialsDiscord) => {
  const discordLoginForms = await page.$$("input");
  for (const [i, discordLoginForm] of discordLoginForms.entries()) {
    if (i == 0) {
      await discordLoginForm?.type(credDiscord.email);
    } else {
      await discordLoginForm?.type(credDiscord.password);
    }
  }
  logger.info("-----------discord fill-in form------------");

  const discordLoginButton = await page.$("button[type=submit]");
  await clickButton(page, discordLoginButton);
  logger.info("-----------discord login success------------");
};

const launchBrowser = async () => {
  const configs: BrowserSettingType = {
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    ignoreDefaultArgs: ["--disable-extensions"],
  };
  if (process.env.ENVIRONMENT === "local") {
    configs.headless = false;
    configs.slowMo = 10;
    configs.executablePath = "/snap/bin/chromium";
    configs.userDataDir = process.env.HOME + "/snap/chromium/common/chromium/";
  } else if (process.env.ENVIRONMENT === "browser") {
    configs.executablePath = "/snap/bin/chromium";
    configs.userDataDir = process.env.HOME + "/snap/chromium/common/chromium/";
  }
  return await puppeteer.launch(configs);
};

const select42Tokyo42Cursus = async (page: Page) => {
  const cursusButton = await page.$('div[aria-label="42tokyo_42cursus"');
  await clickButton(
    page,
    cursusButton,
    'a[aria-label="intra-verify-v2(テキストチャンネル)"]'
  );
  await page.waitForTimeout(1000);
  logger.info("-----------42tokyo cursus selected------------");
};

const selectIntraVerifyV2 = async (page: Page) => {
  const channelButton = await page.$(
    'a[aria-label="intra-verify-v2(テキストチャンネル)"]'
  );
  await clickButton(page, channelButton);
  logger.info("-----------intra-verify-v2 selected------------");
};

const putReaction = async (page: Page) => {
  await page.waitForTimeout(1000);
  const Reactions = await page.$$('div[aria-label="リアクションを付ける"]');
  const lastMessageReaction = Reactions[Reactions.length - 1];
  await lastMessageReaction?.click();

  await page.waitForTimeout(1000);
  const pickerGrid = await page.$("div[id='emoji-picker-grid']");
  const reaction = await pickerGrid?.$('button[data-name="white_check_mark]');
  await reaction?.click();
  logger.info("-----------put reaction------------");
};

const initialLogin = async (page: Page) => {
  const mordalDiv = await page.$("div[role='dialog']");
  return mordalDiv === null ? false : true;
};

const closeMordal = async (page: Page) => {
  const closeButton = await page.$(
    "button[aria-label='閉じる'][type='button']"
  );
  await clickButton(page, closeButton);
  logger.info("-----------close mordal------------");
};

const main = async () => {
  logger.info("start");

  const credentials = setCredentials(process.env);

  const browser = await launchBrowser();
  const page: Page = await browser.newPage();

  const hasLoggedInDiscord = await hasAlreadyLoggedInDiscord(page);
  if (!hasLoggedInDiscord) {
    await loginDiscord(page, credentials.discord);
  } else {
    logger.info("already logged in discord");
  }

  const hasMordalMessaage = await initialLogin(page);
  if (!hasMordalMessaage) {
    await closeMordal(page);
  }
  await page.waitForSelector('div[aria-label="42tokyo_42cursus"]');
  await page.waitForTimeout(1000);

  await select42Tokyo42Cursus(page);
  await selectIntraVerifyV2(page);
  await putReaction(page);

  logger.info("finish");
  await browser.close();
};

main();
