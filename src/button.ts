import puppeteer, { Browser, Page, ElementHandle } from "puppeteer";

const clickButton = async (
  page: Page,
  button: ElementHandle<Element> | null | undefined,
  selector?: string
) => {
  if (!selector) {
    await Promise.all([
      page.waitForNavigation({
        waitUntil: ["load", "networkidle2"],
      }),
      button?.click(),
    ]);
  } else {
    await Promise.all([
      page.waitForNavigation({
        waitUntil: ["load", "networkidle2"],
      }),
      button?.click(),
      page.waitForSelector(selector),
    ]);
  }
};

export default clickButton;
