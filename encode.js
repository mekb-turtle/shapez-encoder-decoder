const fs = require("fs");
const save = require("./save.js");
const file = "savegame.json";
const lz=require("lz-string");
console.log("reading from",file);
const c = fs.readFileSync(file);
console.log("file size is",c.length);
if (c.length < 1024) throw "length is less than 1024 ("+c.length+")";
const c_ = JSON.parse(c.toString());
const f_=JSON.stringify(save.compressObject(c_));
console.log("compressed object");
const {crc32}=require("crc");
const salt="Ec'])@^+*9zMevK3uMV4432x9%iK'=";
const checksum = ("crc32".padEnd(32, "-"))+(crc32(f_+salt).toString(16).padStart(8,"0"));
const d="\x01"+lz.compressToEncodedURIComponent(checksum+f_);
console.log("compressed lz");
const outFile = "savegame.bin";
console.log("writing bin to",outFile);
fs.writeFileSync(outFile, d);

(()=>{
return;
const s_ = require("lz-string").decompressFromEncodedURIComponent(c_);
console.log(s_.substring(0,s_.indexOf("{")+20));
const s = JSON.parse(s_.substring(s_.indexOf("{")));
const f_ = save.decompressObject(s);
const f = JSON.stringify(f_,null,"\t");
console.log("converted");
const outFile = "savegame.json";
console.log("dumping to",outFile);
fs.writeFileSync(outFile, f);
})();
