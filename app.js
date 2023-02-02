const https = require('https');
const JSSoup = require('jssoup').default;
const fs = require('fs');
const url = "https://vi.wikipedia.org/wiki/Kem_l%E1%BA%A1nh"; // FIRST: find a url of a page you are interested in from wikipedia 
const jsonPath = "./json/"; 
const name = "Ice Cream";

/*
This web-scraping example is set up for working with wikipedia.If you want to adapt this
to scrape another site you should go and inspect the site in the browser first, then adapt this. 
*/

//returns one large string of all text
function getParagraphText(soupTag){
    let paragraphs = soupTag.findAll('p');
    let text = '';

    for(let i = 0; i < paragraphs.length; i++){
        let p = paragraphs[i].getText().toLowerCase();
        // text += p;
        if (p.indexOf("tuyết cao") != -1){
            text += p;
            // console.log(p);
        } 
    }
    return text;
}

//pass in Plain Old Javascript Object that's formatted as JSON
function writeJSON(data){
    try {
        let path = jsonPath+name+".json";
        fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf8");
        console.log("JSON file successfully saved");
    } catch (error) {
        console.log("An error has occurred ", error);
    }
}

//create soup  
function createSoup(document){
    
    // create soup
    let soup = new JSSoup(document);

    let main = soup.find('main');//only get the content from the main body of the page
    // console.log(main);
    let bodyContent = soup.find('div', {id: "bodyContent"});
    // console.log(bodyContent);

    let data = {
        "name": name,
        "url": url,
        "content": {}
    }; 

    // console.log(getParagraphText(bodyContent));

    data.content = {
        "text": getParagraphText(main)
       
    };
        
    //output json
    writeJSON(data);
}

//Request the url
https.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    // console.log('headers:', res.headers);
    
    let document = [];

    res.on('data', (chunk) => {
        document.push(chunk);
    }).on('end', () => {
        document = Buffer.concat(document).toString();
        // console.log(document);

        createSoup(document);
    });

}).on('error', (e) => {
    console.error(e);
});

