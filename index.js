// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
import { chromium } from "playwright";

async function sortHackerNewsArticles() {
    // launch browser
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    //base url as variable so easier when switching pages
    const url = "https://news.ycombinator.com/";

    //go to newest page for articles
    await page.goto(`${url}newest`);

    //counter for articles in page
    let counter = 0;

    //save invalid articles into array
    const invalid = [];

    //hold the previous date
    let prev = new Date(
        formatDate(await page.locator(".age").nth(0).getAttribute("title"))
    );

    //loop through 100 articles and increment counter at the end of each loop
    for (let i = 0; i < 100; i++) {
        //assign title, date, and rank to respective elements
        const [title, date, rank] = await Promise.all([
            page.locator(".titleline").nth(counter).innerText(),
            page.locator(".age").nth(counter).getAttribute("title"),
            page.locator(".rank").nth(counter).innerText(),
        ]);

        //create an article object to push to invalid array
        const article = {
            title: title,
            date: date,
            rank: rank,
        };

        //compare prev and date on counter
        const d2 = new Date(
            formatDate(
                await page.locator(".age").nth(counter).getAttribute("title")
            )
        );

        //if the previous date is less than the current article's date, push to invalid array
        if (prev < d2) {
            invalid.push(article);
        }

        //set prev to the current date
        prev = d2;

        //if counter is greater than 28, go to next page
        if (counter > 28) {
            //Get the link from the button and go to page
            let href = await page.locator(".morelink").getAttribute("href");
            await page.goto(`${url}${href}`);

            //set counter back to -1 since it will be incremented to 0
            counter = -1;
        }

        counter++;
    }

    //if there are invalid articles, print them out
    if (invalid.length > 0) {
        console.log(
            `There are ${invalid.length} articles that are not in the correct order.\nThey are listed below:`
        );
        for (let e of invalid) {
            console.log(e);
        }
    } else {
        console.log("All articles are in the correct order.");
    }

    await browser.close();
}

//format the date into something js can read
const formatDate = (str) => {
    let f = "";
    for (const char of str) {
        if (char === " ") {
            break;
        }

        f += char;
    }
    return f;
};

(async () => {
    await sortHackerNewsArticles();
})();
