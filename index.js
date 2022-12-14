const puppeteer = require('puppeteer');

let config = {
  launchOptions: {
    headless: false

  }
}

//locators
const LoginPage = {
  email: 'input[id="ctl00_MainContentPlaceHolder_txtUsername"]',
  password: 'input[id="ctl00_MainContentPlaceHolder_txtPassword"]',
  domain: 'input[id="ctl00_MainContentPlaceHolder_txtDomainName"]',
  loginButton: 'input[id="ctl00_MainContentPlaceHolder_btnLogin"]'
}

const MainPage = {
  WAIT: 'li[id="cartSummaryMenu"]',
  QuoteButton: 'a[class="btn"]',
}

const Quote = {
  SaveQuoteButton: 'img[title="Save Quote"]',
  DistributorS: 'select[tabindex="3"]',
  OptionC: '//*[@id="quote-info-section"]/div/div[1]/div/div[3]/div/select/option[4]',
  SaveQ: 'img[title="Save Quote"]',
  ConfigureB: 'img[title="Configure Solution"]'
}


const Overview = {
  AddSiteB: 'i[class="fa fa-plus-circle"]',
  ActionB: 'button[class="btn btn-primary btn-sm dropdown-toggle autoClosePopover"]',
  ChangeB: 'button[title = "Edit"]'
}

const SolutionS = {
  ProductC: 'select[tabindex="2"]',
  PCInput: 'input[tabindex="1"]',
  SProduct: 'select[tabindex="3"]',
  ASProduct: 'button[id="attributesContainer"]',
  ASAction: 'i[class="fa fa-cog"]',
  ASEdit: 'button[title="Edit"]'
}

const ProductA = {
  QtyDy:'input[tabindex="5"]',
  Drp: 'a[data-toggle="dropdown"]',
  CP200Q: 'input[id="9616_3_3"]',
  Con: 'div[class="config-container"]',
  Ba: 'input[value="100"]'
}

let x = mutli(4, 3);   

function mutli(a, b) {
  return a * b;             
}

puppeteer.launch(config.launchOptions).then(async browser => {
  //const browser = await puppeteer.launch(); //taking pdf obly works in headless mode
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080});
  await page.goto('https://eusb.webcomcpq.com/login.aspx');
  await page.type(LoginPage.email, "bturgay");
  await page.type(LoginPage.password, "Password1234");
  await page.type(LoginPage.domain, "unifygermany");
  await page.click(LoginPage.loginButton);
  await page.waitForSelector(MainPage.WAIT,{waitUntil:"domcontentloaded"});
  
  const elements = await page.$x('//*[@id="wrap"]/div[2]/a[1]/i')
  await elements[0].click() 
  await page.waitForSelector(Quote.SaveQuoteButton);
  
  await page.evaluate(() => {
    document.querySelector("#quote-info-section > div > div:nth-child(1) > div > div:nth-child(3) > div > select > option:nth-child(4)").setAttribute("value","Herweck AG");
  })
  await page.select(Quote.DistributorS,'Herweck AG');
  
  await page.waitForSelector(Quote.ConfigureB,{waitUntil: "networkidle2"});
  
  const [button1] = await page.$x('//*[@id="actionContainer"]/div[2]/div[2]/div[1]/a');
  if (button1) {
    await page.waitForResponse(response => response.status() === 200);
    await button1.click();
  } else {
    console.log("Fail to click on the button");
  }
  
  await page.waitForXPath('//*[@id="attributesContainer"]/div/div[2]/div[2]/div[6]/div[2]/button',3000,{waitUntil:'domcontentloaded'});
  
  const [AddButton] = await page.$x('//*[@id="attributesContainer"]/div/div[2]/div[2]/div[6]/div[2]/button');
  if (AddButton) {
    await page.waitForResponse(response => response.status() === 200);
    await AddButton.click();
  } else {
    console.log("Fail to click on the AddButton");
  }
  await page.waitForSelector(Overview.ActionB,{waitUntil:'networkidle2'});
  await page.click(Overview.ActionB);
  await page.click(Overview.ChangeB);
  
  await page.waitForSelector(SolutionS.ProductC,{waitUntil:'networkidle2'});
  
  await page.evaluate(() => {
    document.querySelector("#attributesContainer > div > div:nth-child(2) > div.attributes.fiori3-attributes.flex > div:nth-child(6) > select > option:nth-child(7)").setAttribute("value","OpenScape Voice");
  })
  await page.select(SolutionS.ProductC,'OpenScape Voice');
  
  
  await page.waitForSelector(SolutionS.SProduct,{waitUntil:'domcontentloaded'});
  await page.evaluate(() => {
    document.querySelector("#attributesContainer > div > div:nth-child(2) > div.attributes.fiori3-attributes.flex > div:nth-child(7) > select > option:nth-child(2)").setAttribute("value","OpenScape Voice");
  })
  await page.select(SolutionS.SProduct,'OpenScape Voice');
  
  await page.waitForSelector('#attributesContainer > div > div:nth-child(2) > div.attributes.fiori3-attributes.flex > div:nth-child(8) > button',{waitUntil:'networkidle2'});
  await page.click('#attributesContainer > div > div:nth-child(2) > div.attributes.fiori3-attributes.flex > div:nth-child(8) > button');
  await page.waitForSelector(SolutionS.ASAction,{waitUntil:'domcontentloaded'});
  await page.click(SolutionS.ASAction);
  await page.click(SolutionS.ASEdit);
  
  await page.waitForXPath('//*[@id="attributesContainer"]/div/div[2]/div[2]/div[8]/ul/li/p/span[1]/label/span',{waitUntil:'domcontentloaded'});
  await page.waitForSelector(ProductA.QtyDy,{waitUntil:'domcontentloaded'}),
  await page.type(ProductA.QtyDy,'200');
  await page.evaluate(() => {
    document.querySelector("#attributesContainer > div > div:nth-child(2) > div.attributes.fiori3-attributes.flex > div:nth-child(8) > ul > li > p > span.l.col-md-7.clear-padding > label > span").click();
  })
  await page.evaluate(() => {
    document.querySelector("#attributesContainer > div > div.tabbable.show-large > ul > li:nth-child(2) > a > span").click();
  })
  await page.waitForXPath('//*[@id="attributesContainer"]/div/div[2]/div[2]/div[4]/ul/li[1]/p/span[1]/label/input',30000,{waitUntil:'domcontentloaded'});
  
  //Selecting multiple options in SBC and Gateway section
  await page.evaluate(()=>{
    document.querySelector("#attributesContainer > div > div:nth-child(2) > div.attributes.fiori3-attributes.flex > div:nth-child(4) > ul > li:nth-child(1) > p > span.l.col-md-7.clear-padding > label > span").click();
    document.querySelector("#attributesContainer > div > div:nth-child(2) > div.attributes.fiori3-attributes.flex > div:nth-child(4) > ul > li:nth-child(2) > p > span.l.col-md-7.clear-padding > label > span").click();
    // document.querySelector("#attributesContainer > div > div:nth-child(2) > div.attributes.fiori3-attributes.flex > div:nth-child(4) > ul > li:nth-child(3) > p > span.l.col-md-7.clear-padding > label > span").click();
    // document.querySelector("#attributesContainer > div > div:nth-child(2) > div.attributes.fiori3-attributes.flex > div:nth-child(5) > ul > li > p > span.l.col-md-7.clear-padding > label > input").click();
    // document.querySelector("#attributesContainer > div > div:nth-child(2) > div.attributes.fiori3-attributes.flex > div:nth-child(6) > ul > li > p > span.l.col-md-7.clear-padding > label > input").click();
    // document.querySelector("#attributesContainer > div > div:nth-child(2) > div.attributes.fiori3-attributes.flex > div:nth-child(7) > ul > li > p > span.l.col-md-7.clear-padding > label > input").click();  
  })
  
  await page.waitForXPath('//*[@id="attributesContainer"]/div/div[1]/ul/li[3]/a/span',3000000,{waitUntil:'domcontentloaded'});   
  await page.evaluate(() => {
    document.querySelector("#attributesContainer > div > div.tabbable.show-large > ul > li:nth-child(3) > a > span").click();
  })
  
  await page.waitForXPath('//*[@id="attributesContainer"]/div/div[2]/div[2]/div[3]/ul/li/p/span[1]/label/input',3000000,{waitUntil:'domcontentloaded'});
  await page.evaluate(() => {
    document.querySelector("#attributesContainer > div > div:nth-child(2) > div.attributes.fiori3-attributes.flex > div:nth-child(3) > ul > li > p > span.l.col-md-7.clear-padding > label > input").click();
  })
  
  await page.waitForXPath('//*[@id="attributesContainer"]/div/div[1]/ul/li[5]/a/span',3000000,{waitUntil:'domcontentloaded'});   
  await page.evaluate(() => {
    document.querySelector("#attributesContainer > div > div.tabbable.show-large > ul > li:nth-child(5) > a > span").click();
  })
  
  await page.waitForXPath('//*[@id="attributesContainer"]/div/div[2]/div[2]/div[3]/select',3000000,{waitUntil:'domcontentloaded'});
  await page.evaluate(() => {
    document.querySelector("#attributesContainer > div > div:nth-child(2) > div.attributes.fiori3-attributes.flex > div:nth-child(3) > select > option:nth-child(2)").setAttribute('value','OpenScape Desk Phone CP (IP)');
  })
  await page.select('#attributesContainer > div > div:nth-child(2) > div.attributes.fiori3-attributes.flex > div:nth-child(3) > select','OpenScape Desk Phone CP (IP)');
  
  await page.waitForXPath('//*[@id="9616_3_14"]',3000000,{waitUntil:'domcontentloaded'});
  // await page.waitForXPath('//*[@id="no-more-tables"]',3000000,{waitUntil:'networkidle2'});
  if(await page.waitForXPath('//*[@id="9616_3_14"]',3000000,{waitUntil:'domcontentloaded'}) != null){
    await page.waitForSelector('#\\39 616_3_14',3000000,{waitUntil:'networkidle2'});
    await page.evaluate(() => {
      document.querySelector("#\\39 616_3_14").click();
      document.querySelector("#\\39 616_3_14").setAttribute('value','100');
    })
    await page.type(ProductA.Ba,'100');
    await page.keyboard.press('Enter');
  }

  //Code below goes to Configure summary tab
  await page.evaluate(() => {
    document.querySelector("#attributesContainer > div > div.tabbable.show-large > ul > li:nth-child(8) > a > span").click();
  })
  
  // The code below will not work becuase of the screen adjustments are adjust to fullscreen. it will work if you drop down the screen adjustments in line 55
  //Code below goes to Configure summary tab throught dropdown menu
  // await page.evaluate(() => {
    //   document.querySelector("#attributesContainer > div > div.tabbable.show-large > ul > li.dropdown.pull-right.tabdrop > a").click();
    //   document.querySelector("#attributesContainer > div > div.tabbable.show-large > ul > li.dropdown.pull-right.tabdrop.open > ul > li:nth-child(1) > a > span").click();
    // })

  await page.waitForXPath('//*[@id="no-more-tables"]/table/tbody/tr[1]/td[7]',{waitUntil:'domcontentloaded'});
  // await page.waitForXPath('//*[@id="no-more-tables"]/table/tbody/tr[1]/td[3]',{waitUntil:'domcontentloaded'});
  await page.waitForXPath('//*[@id="attributesContainer"]/div/div[2]/div[2]/div[2]/label',{waitUntil:'domcontentloaded'});
  // await page.waitForSelector(ProductA.Con,{waitUntil:'networkidle2'})
  
  //checks if the element L30250-F600-C426 value exist in the Configure summery
  if((await page.waitForXPath('//*[contains(text(), "L30250-F600-C426")]',30000,{waitUntil:'domcontentloaded'})) != null){
    const [element] = await page.$x('//*[contains(text(), "L30250-F600-C426")]');
    chk2 = await page.evaluate(name => name.innerText, element);
    const [element3] = await page.$x('//a[contains(text(), "L30250-F600-C426")]');
    chk3 = await page.evaluate(name => name.innerText, element3);
    if (chk2 == 'L30250-F600-C426'){
      chk = 'Success';
      console.log('The result from L30250-F600-C426 is , ',chk);
    }else{
      chk = 'Failed';
      console.log('The result from L30250-F600-C426 is , ',chk);
    }//checks if the results are exist in both configure summary and in the right side table and checks if both of them are correct results
    if(chk2 == chk3){
      chk2 = 'Success';
      console.log('and the result from L30250-F600-C426 is exist in configure is and same results , ',chk2);
    }else{
      chk2 = 'Failed';
      console.log('and the result from L30250-F600-C426 is exist in configure is and same results , ',chk2);
    }
  }else{
    console.log('the target L30250-F600-C426 is not exist');
  }
  await page.waitForXPath('//*[@id="no-more-tables"]/table/tbody/tr[1]/td[7]',{waitUntil:'domcontentloaded'});
  //checks if the element L30220-D600-A617 value exist in the Configure summery
  if((await page.waitForXPath('//*[contains(text(), "L30220-D600-A617")]',30000,{waitUntil:'domcontentloaded'})) != null){
    const [element2] = await page.$x('//*[contains(text(), "L30220-D600-A617")]');
    chk2 = await page.evaluate(name => name.innerText, element2);
    const [element3] = await page.$x('//a[contains(text(), "L30220-D600-A617")]');
    chk3 = await page.evaluate(name => name.innerText, element3);
    if(chk2 == 'L30220-D600-A617'){
      chk = 'Success';
      console.log('The result from L30220-D600-A617 is exist, ',chk);
    }else{
      chk = 'Failed';
      console.log('The result from L30220-D600-A617 is exist, ',chk);
    }//checks if the results are exist in both configure summary and in the right side table and checks if both of them are correct results  
    if(chk2 == chk3){
      chk2 = 'Success';
      console.log('and the result from L30220-D600-A617 is exist in configure is and same results , ',chk2);
    }else{
      chk2 = 'Failed';
      console.log('and the result from L30220-D600-A617 is exist in configure is and same results , ',chk2);
    }  
  }else{
    console.log('the target L30220-D600-A617 value is not exist');
  }  
  await page.waitForXPath('//*[@id="no-more-tables"]/table/tbody/tr[1]/td[7]',{waitUntil:'domcontentloaded'});
  //checks if the element L30220-D600-A647 value exist in the Configure summery
  if((await page.waitForXPath('//*[contains(text(), "L30220-D600-A647")]',30000,{waitUntil:'domcontentloaded'})) != null){
    const [element2] = await page.$x('//*[contains(text(), "L30220-D600-A647")]');
    chk2 = await page.evaluate(name => name.innerText, element2);
    const [element3] = await page.$x('//a[contains(text(), "L30220-D600-A647")]');
    chk3 = await page.evaluate(name => name.innerText, element3);
    if(chk2 == 'L30220-D600-A647'){
      chk = 'Success';
      console.log('The result from L30220-D600-A647 is exist, ',chk);
    }else{
      chk = 'Failed';
      console.log('The result from L30220-D600-A647 is exist, ',chk);
    }//checks if the results are exist in both configure summary and in the right side table and checks if both of them are correct results  
    if(chk2 == chk3){
      chk2 = 'Success';
      console.log('and the result from L30220-D600-A647 is exist in configure is and same results , ',chk2);
    }else{
      chk2 = 'Failed';
      console.log('and the result from L30220-D600-A647 is exist in configure is and same results , ',chk2);
    }  

  }else{
    console.log('the target L30220-D600-A647 value is not exist');
  }  
  await page.waitForXPath('//*[@id="no-more-tables"]/table/tbody/tr[1]/td[7]',{waitUntil:'domcontentloaded'});
 //checks if the element L30280-D622-F281 value exist in the Configure summery 
  if((await page.waitForXPath('//*[contains(text(), "L30280-D622-F281")]',30000,{waitUntil:'domcontentloaded'})) != null){
    const [element2] = await page.$x('//*[contains(text(), "L30280-D622-F281")]');
    chk2 = await page.evaluate(name => name.innerText, element2);
    const [element3] = await page.$x('//a[contains(text(), "L30280-D622-F281")]');
    chk3 = await page.evaluate(name => name.innerText, element3);
    if(chk2 == 'L30280-D622-F281'){
      chk = 'Success';
      console.log('The result from L30280-D622-F281 is exist, ',chk);
    }else{
      chk = 'Failed';
      console.log('The result from L30280-D622-F281 is exist, ',chk);
    }//checks if the results are exist in both configure summary and in the right side table and checks if both of them are correct results  
    if(chk2 == chk3){
      chk2 = 'Success';
      console.log('and the result from L30280-D622-F281 is exist in configure is and same results , ',chk2);
    }else{
      chk2 = 'Failed';
      console.log('and the result from L30280-D622-F281 is exist in configure is and same results , ',chk2);
    }  
    
  }else{
    console.log('the target L30280-D622-F281 value is not exist');
  }  
  await page.waitForXPath('//*[@id="no-more-tables"]/table/tbody/tr[1]/td[7]',{waitUntil:'domcontentloaded'});
  //checks if the element L30220-D622-B11 is exist in the Configure summery
  if((await page.waitForXPath('//*[contains(text(), "L30220-D622-B11")]',30000,{waitUntil:'domcontentloaded'})) != null){
    const [element] = await page.$x('//*[contains(text(), "L30220-D622-B11")]');
    chk2 = await page.evaluate(name => name.innerText, element);
    const [element3] = await page.$x('//a[contains(text(), "L30220-D622-B11")]');
    chk3 = await page.evaluate(name => name.innerText, element3);
    if (chk2 == 'L30220-D622-B11'){
      chk = 'Success';
      console.log('The result from L30220-D622-B11 is , ',chk);
    }else{
      chk = 'Failed';
      console.log('The result from L30220-D622-B11 is , ',chk);
    }//checks if the results are exist in both configure summary and in the right side table and checks if both of them are correct results  
    if(chk2 == chk3){
      chk2 = 'Success';
      console.log('and the result from L30220-D622-B11 is exist in configure is and same results , ',chk2);
    }else{
      chk2 = 'Failed';
      console.log('and the result from L30220-D622-B11 is exist in configure is and same results , ',chk2);
    }  
  }else{
    console.log('the target L30220-D622-B11 is not exist');
  }  

  // await delay(5000);
  // await page.screenshot({path: 'logedin.png', fullPage:true});
  await browser.close();
});

