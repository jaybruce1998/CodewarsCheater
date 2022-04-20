//node cheater.js
const puppeteer=require("puppeteer");//lets you use google chrome invisibly
async function sleep(seconds)//pages need time to load
{
  return new Promise(resolve=>setTimeout(resolve, seconds * 1000));
};
async function f()
{
  //2 browser windows so we can log in to two different accounts
  const b1=await puppeteer.launch({...false?{executablePath: browserPath}: {}, args: ['--disable-dev-shm-usage']});
  const b2=await puppeteer.launch({...false?{executablePath: browserPath}: {}, args: ['--disable-dev-shm-usage']});
  const a=await b1.newPage(), b=await b2.newPage();//create a tab in each one
  //log in to both accounts
  await a.goto("https://www.codewars.com/users/sign_in", {waitUntil: 'domcontentloaded'});
  await a.click("#user_email");
  await a.keyboard.type("cakab38495@provlst.com");//the username to boost
  await a.click("#user_password");
  await a.keyboard.type("password");
  await a.keyboard.press("Enter");
  await b.goto("https://www.codewars.com/users/sign_in", {waitUntil: 'domcontentloaded'});
  await b.click("#user_email");
  await b.keyboard.type("emailHere");//an account that's a high rank (otherwise it can't look at harder problems)
  await b.click("#user_password");
  await b.keyboard.type("passwordHere");//don't hack me :(
  await b.keyboard.press("Enter");
  for(let i=1; i; i++)
  {
    console.log(i);
    await a.goto("https://www.codewars.com/trainer/javascript", {waitUntil: 'domcontentloaded'});//load random problem
    let url=a.url();
    url=url.substring(0, url.length-10);
    await b.goto(url+"solutions/javascript", {waitUntil: 'domcontentloaded'});//load solutions tab on helper account
    try
    {
      await b.click(".btn.js-unlock-solutions");//might not exist, in which case solutions are already loaded
      await sleep(4);
      console.log("New");
    }catch(_){};
    url+="train/javascript";
    await a.goto(url);//load the page where you type your solution to the problem
    //on the helper page, get the last code block (solution to a problem) and change the HTML formatting back to plaintext
    const code=await b.evaluate(`const a=document.getElementsByTagName("code");
      a[a.length-1].innerHTML.replace(/<span[^>]+>|<\\/span>/g, "").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");`);
    await b.goto('https://obfuscator.io/', {waitUntil: 'domcontentloaded'});//time to obfuscate so we don't get caught as easily
    await b.evaluate(`const t=document.getElementsByTagName("textarea")[0];t.focus();t.select();`);//only one textbox, select it and type there
    await b.keyboard.sendCharacter(code);//faster than typing it, it's like copying and pasting
    await b.click(".ui.primary.button");//generate obfuscated code
    await sleep(1);
    //extract HTML version of code and convert to plaintext
    const obf=await b.evaluate(`document.getElementsByTagName("textarea")[0].innerHTML.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");`);
    //specific to macs (Meta is command, so it's used for keyboard shortcuts)
    await a.keyboard.down('Meta');
    await a.keyboard.press('A');
    await a.keyboard.up('Meta');
    await a.keyboard.sendCharacter(code);//type our solution, obf for obfuscated
    //submit solution
    await a.keyboard.down('Meta');
    await a.keyboard.press('Enter');
    await a.keyboard.up('Meta');
    await sleep(5);//some solutions take longer than 5 seconds (could be up to 12), some shorter, some fail because obfuscation ruined
    //our code, but 5 is fine for most problems
  }
  await a.screenshot({path: "page.png"});//can be used to save a screenshot
}
f().then(_=>process.exit()).catch(f);