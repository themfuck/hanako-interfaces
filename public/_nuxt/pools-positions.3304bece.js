import{_ as ge}from"./refresh-icon.cc4de046.js";import{_ as ye}from"./coin-pair-name.147e4f70.js";import{_ as he}from"./assets-card.39257fd2.js";import{a as q,l as D,o as l,m as a,p as n,t as v,s as k,q as g,N as Q,r as t,h as Y,a7 as E,i as Z,v as m,w as J,M as Se,B as x,y as ee,z as oe,b as be,e as L,A as ke,ad as Ae,ae as Pe,c as T}from"./entry.5826856b.js";import{_ as $e}from"./swap-setting.d0c9cad2.js";import{_ as we}from"./icon-check_2x.3da22abb.js";import{_ as _e}from"./coin-select.9d13bd74.js";import{_ as Me}from"./add-liquidity.8892ffd4.js";/* empty css              */import"./img-no-Positions_2x.7a5d8c0c.js";import"./img-no-Positions_2x.46d8a631.js";import"./status-block.e6a30e79.js";import"./coin-tab.e2492157.js";const Ie=q({props:{inputValue:{type:String,required:!0},pType:{type:String,default:"Max"},fromCoin:{type:Object,default:()=>({})},toCoin:{type:Object,default:()=>({})},dirction:{type:Boolean,default:!0},defaultMaxPrice:{type:String,default:""}}});const Be={class:"set-price-item"},Oe={class:"title"},Re={class:"input-box"},Ve={class:"minus-btn"},Ee={class:"plus-btn"};function Le(e,o,r,p,C,y){const h=Q;return l(),a("div",Be,[n("h3",Oe,v(e.pType)+" Price",1),n("div",Re,[n("a",Ve,[n("div",{class:k(!e.fromCoin&&!e.toCoin?"reductionDis":"reduction")},null,2)]),g(h,{id:"pValu",value:e.inputValue,autocomplete:"off",oninput:"this.value = this.value.replace(/[^\\d.]/g,'');",onInput:o[0]||(o[0]=S=>e.$emit("onInput",S.target.value))},null,8,["value"]),n("a",Ee,[n("div",{class:k(!e.fromCoin&&!e.toCoin?"addDis":"add")},null,2)])]),n("p",{class:k(["per-text",!e.toCoin&&!e.fromCoin?"per-text-disabled":""])},v(e.toCoin&&e.toCoin.symbol)+" per "+v(e.fromCoin&&e.fromCoin.symbol),3)])}const K=D(Ie,[["render",Le],["__scopeId","data-v-d73ac0a1"]]),Ue=q({props:{min:{type:String,default:""},max:{type:String,default:""},defaultMinPrice:{type:String,default:""},defaultMaxPrice:{type:String,default:""},fromCoin:{type:Object,default:()=>({})},toCoin:{type:Object,default:()=>({})},dirction:{type:Boolean,default:!0},invalidPriceRange:{type:Boolean,default:!1}},setup(e,o){let r=t(""),p=t(""),C=t(!1),y=t(!1);Y(()=>{r.value=e.min,p.value=e.max}),E(()=>e.min,(s,f)=>{s!==f&&(r.value=e.min)}),E(()=>e.max,(s,f)=>{s!==f&&(p.value=e.max)}),E(r,(s,f)=>{s!==f&&o.emit("onChangeMinPrice",s)}),E(p,(s,f)=>{s!==f&&o.emit("onChangeMaxPrice",s)});const h=()=>{r.value=e.defaultMinPrice,p.value=e.defaultMaxPrice,y.value=!1,C.value=!1};return{importIcon:Z,resetPrice:h,changeShowUnderStand:()=>{C.value=!C.value,C.value?y.value=!0:h(),y.value||(r.value=e.defaultMinPrice,p.value=e.defaultMaxPrice)},showUnderStand:y,minPrice:r,maxPrice:p,understand:()=>{y.value=!1,r.value="0",p.value="\u221E"},isRadio:C}}});const F=e=>(ee("data-v-5129cc17"),e=e(),oe(),e),Te={class:"set-price"},qe={class:"title"},De=F(()=>n("div",{class:"left"},"Set Price Range",-1)),Fe={class:"right"},Ge={class:"check-img"},je={key:0,src:we,alt:""},Ne=F(()=>n("span",null,"Full range",-1)),ze={class:"card-container"},He={key:0,class:"card"},We=["src"],Xe={key:1,class:"understand"},Ke=F(()=>n("div",{class:"left"},[n("p",null,"Lower Efficiency"),n("p",null,"Please note that full range positions may earn less fees than concentrated liquidity.")],-1)),Qe={class:"right"};function Ye(e,o,r,p,C,y){const h=K,S=K,b=x;return l(),a("div",Te,[n("div",qe,[De,n("div",Fe,[n("span",{onClick:o[0]||(o[0]=(...s)=>e.resetPrice&&e.resetPrice(...s))},"Reset"),n("div",{class:"full-range-btn",onClick:o[1]||(o[1]=s=>e.changeShowUnderStand())},[n("div",Ge,[e.isRadio?(l(),a("img",je)):m("",!0)]),Ne])])]),n("div",ze,[e.showUnderStand?(l(),a("div",Xe,[Ke,n("div",Qe,[g(b,{onClick:e.understand},{default:J(()=>[Se("I understand")]),_:1},8,["onClick"])])])):(l(),a("div",He,[g(h,{modelValue:e.minPrice,"onUpdate:modelValue":o[2]||(o[2]=s=>e.minPrice=s),"input-value":e.minPrice,"p-type":"Min","default-max-price":e.defaultMaxPrice,"from-coin":e.fromCoin,"to-coin":e.toCoin,dirction:e.dirction,onOnInput:o[3]||(o[3]=s=>e.minPrice=s)},null,8,["modelValue","input-value","default-max-price","from-coin","to-coin","dirction"]),g(S,{modelValue:e.maxPrice,"onUpdate:modelValue":o[4]||(o[4]=s=>e.maxPrice=s),"input-value":e.maxPrice,"p-type":"Max","default-max-price":e.defaultMaxPrice,"from-coin":e.fromCoin,"to-coin":e.toCoin,dirction:e.dirction,onOnInput:o[5]||(o[5]=s=>e.maxPrice=s)},null,8,["modelValue","input-value","default-max-price","from-coin","to-coin","dirction"]),n("img",{src:e.importIcon("/image/lmg-line@2x.png"),alt:""},null,8,We)]))])])}const Ze=D(Ue,[["render",Ye],["__scopeId","data-v-5129cc17"]]),Je=q({setup(){const e=be(),o=t(20),r=t(0),p=t(null),C=t(!1),y=t(!1),h=t(!1),S=t("fromCoin"),b=t(""),s=t(""),f=t(!1),I=t(!0),B=t(!1),O=t(!0),U=t(!0),P=t(!1),$=t(""),M=t(""),w=t("0.999"),_=t("1.001"),R=t("0.999"),i=t("1.001"),V=t(!1),G=t(!1),ne=t(!1),j=t("0.3% fee tier"),ie=()=>{r.value=0,B.value=!0,setTimeout(()=>{B.value=!1},1e3)},te=L(()=>Number(w.value)>Number(_.value)),se=L(()=>[{label:"0.05% fee tier",title:"0.05% fee",text:"Best for stable pairs."},{label:"0.3% fee tier",title:"0.3% fee",text:"Best for most pairs."},{label:"1% fee tier",title:"1% fee",text:"Best for exotic pairs."}]),le=L(()=>e.slippage),ae=L(()=>P.value?"Select a token":Number($.value)?"Add Liquidity":"Enter an amount"),d=t({symbol:"SOL",name:"Wrapped SOL",mintAddress:"11111111111111111111111111111111",token_mint:"11111111111111111111111111111111",decimals:9,decimal:9,official:!0,showDefault:!0,balance:111}),c=t({symbol:"USDC",name:"USD Coin",token_mint:"Ap4nbtHLUbUedzKQnEGu5EQcgfonVsCX3pWdZgKq8GwH",swap_token_account:"BntG1ST8owGCUsWWuABwuDqdMVkC6LxXxdGbHzyhfRtr",decimal:9,show_decimal:4,icon:"https://archive.crema.finance/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",balance:777});Y(()=>{N()});const re=u=>{w.value=u},ue=u=>{_.value=u},de=()=>{const u=d.value;d.value=c.value,c.value=u,I.value=!I.value},ce=u=>{var z,H,W,X;S.value=u,u==="fromCoin"?(b.value=((z=c.value)==null?void 0:z.symbol)||"",s.value=((H=d.value)==null?void 0:H.symbol)||""):(b.value=((W=d.value)==null?void 0:W.symbol)||"",s.value=((X=c.value)==null?void 0:X.symbol)||""),f.value=!0},me=u=>{P.value=!1,S.value==="fromCoin"?(c.value&&u.symbol.toLowerCase()===(c==null?void 0:c.value.symbol.toLowerCase())&&(c.value=null),d.value=u):(d.value&&u.symbol.toLowerCase()===(d==null?void 0:d.value.symbol.toLowerCase())&&(d.value=null),c.value=u),f.value=!1},pe=u=>{u==="fromCoin"?(O.value=!0,$.value=d.value&&d.value.balance):(O.value=!1,M.value=c.value&&c.value.balance)},N=()=>{p.value=setInterval(()=>{C.value||r.value<o.value&&(r.value+=1,r.value===o.value&&(r.value=0))},1e3)},fe=()=>{d.value=null,c.value=null,w.value="0",_.value="0",$.value="",M.value="",P.value=!0,j.value="",V.value=!1},ve=t(!1),Ce=ke();return{importIcon:Z,refresh:B,addLiquidityBtnText:ae,slippage:le,isShowSwapSetting:y,autoRefreshTime:o,countdown:r,setMarketTimer:N,marketTimer:p,loading:C,fromCoin:d,toCoin:c,openCoinSelect:ce,onCoinSelect:me,existingCoins:b,lastSelectCoin:s,currentCoinKey:S,showCoinSelect:f,fromCoinAmount:$,toCoinAmount:M,maxBtnSelect:pe,fixedFromCoin:O,isShowLiquidityModal:ve,direct:I,toggle:de,edit:V,inputValue:j,feeTierList:se,minPrice:w,maxPrice:_,direction:U,invalidPriceRange:te,defaultMinPrice:R,defaultMaxPrice:i,priceRangeChangeMin:re,priceRangeChangeMax:ue,unilateral:h,clearAll:fe,clickClear:P,positionError:ne,positionTips:G,router:Ce,clickRefresh:ie}}}),xe="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAM1BMVEUAAAAlW04mW04oXlEmXE4SHx4mW052/9wkSEERFxYVJyUfRTsPDw8kV0ofSD5k17szaV1uzTFCAAAABXRSTlMA8K0mw1QezgsAAADGSURBVFjD7djbCoMwDIDhHta0jTb1/Z92ggREuk2XCmXLf+nFB1WhIeZS3lnrvBHnLaxZueRgynkCZ14E58vznMEa7gFbX0IlcOkIhXPRdjQ6PL4OYYG1gmIoIJVCGKQQp5BCCt0DYa3YBUoxJoUU+lvIOwBCOeRt6xrGtGuJcUm7sAm55mBQ45tqE7I8qtwDyY8mf9njfP4B/2yFFPo4RIw11iikkEI/BSEBOC+HsPBOSQjRbqcEknin1A3qti4bZ4HHK8Un/jpcXovWzbgAAAAASUVORK5CYII=",eo=""+new URL("img-no-data_2x.6b00f1d1.png",import.meta.url).href;const A=e=>(ee("data-v-43c36ed5"),e=e(),oe(),e),oo={class:"pools-container"},no={class:"title"},io={class:"left"},to=A(()=>n("span",null,"Concentrated Liquidity",-1)),so={class:"right title-right"},lo=A(()=>n("svg",{class:"icon","aria-hidden":"true"},[n("use",{"xlink:href":"#icon-a-icon-setslippage"})],-1)),ao={class:"content"},ro={class:"left"},uo={class:"pools-card"},co={class:"first-card"},mo={class:"top"},po={key:0,class:"toggle"},fo={key:0,class:"fee-container"},vo=["onClick"],Co=["src"],go={class:"card-container"},yo={class:"card-item"},ho={class:"card-item"},So={key:0,class:"unilateral"},bo=["src"],ko=A(()=>n("p",null,"The market price is outside your specified price range. Single-asset deposit only.",-1)),Ao=A(()=>n("svg",{class:"icon","aria-hidden":"true"},[n("use",{"xlink:href":"#icon-icon-add"})],-1)),Po={class:"right"},$o={class:"title"},wo={class:"titLeft"},_o={key:0},Mo={key:1,class:"coin"},Io={key:0,class:"zoom"},Bo=A(()=>n("div",{class:"amplification"},null,-1)),Oo=A(()=>n("div",{class:"narrow"},null,-1)),Ro=[Bo,Oo],Vo={class:"chart-img"},Eo={key:0,class:"noDataImg",src:eo},Lo={key:0,class:"position-tips"},Uo=["src"],To=A(()=>n("p",{class:"tips"},"Your position will not earn fees or be used in trades until the market price moves into your range.",-1)),qo={key:1,class:"position-tips"},Do=["src"],Fo=A(()=>n("p",{class:"error"},"The max price should be higher than min price.",-1));function Go(e,o,r,p,C,y){var P,$,M,w,_,R;const h=ge,S=ye,b=Q,s=he,f=x,I=Ze,B=_e,O=$e,U=Me;return l(),a("div",oo,[n("div",no,[n("div",io,[to,n("div",{class:"position",onClick:o[0]||(o[0]=i=>e.router.push("/position-list"))},"My Position")]),n("div",so,[n("span",{class:"clear",onClick:o[1]||(o[1]=(...i)=>e.clearAll&&e.clearAll(...i))},"Clear All"),n("div",{class:"slippage-icon",onClick:o[2]||(o[2]=i=>e.isShowSwapSetting=!0)},[lo,n("span",null,v(e.slippage)+"%",1)]),g(h,{loading:e.refresh,"auto-refresh-time":e.autoRefreshTime,countdown:e.countdown,onClickRefresh:o[3]||(o[3]=i=>e.clickRefresh())},null,8,["loading","auto-refresh-time","countdown"])])]),n("div",ao,[n("div",ro,[n("div",uo,[n("div",co,[n("div",mo,[g(S,{"from-coin":e.fromCoin,"to-coin":e.toCoin},null,8,["from-coin","to-coin"]),e.fromCoin&&e.toCoin?(l(),a("div",po,[n("div",{class:k(e.direct?"item active-item":"item"),onClick:o[4]||(o[4]=i=>e.direct?"":e.toggle())},v(e.direct?(P=e.fromCoin)==null?void 0:P.symbol:($=e.toCoin)==null?void 0:$.symbol),3),n("div",{class:k(e.direct?"item ":"item active-item"),onClick:o[5]||(o[5]=i=>e.direct?e.toggle():"")},v(e.direct?(M=e.toCoin)==null?void 0:M.symbol:(w=e.fromCoin)==null?void 0:w.symbol),3)])):m("",!0)]),g(b,{placeholder:"Fee Tier",value:e.inputValue,disabled:""},null,8,["value"]),n("div",{class:k(e.clickClear||!e.fromCoin||!e.toCoin?"isEdit isEdit-noHover":"isEdit"),onClick:o[6]||(o[6]=i=>e.clickClear||!e.fromCoin||!e.toCoin?"":e.edit=!e.edit)},v(e.clickClear||!e.fromCoin||!e.toCoin?"Edit after selecting a pool":e.edit?"Hide":"Edit"),3),e.edit?(l(),a("div",fo,[(l(!0),a(Ae,null,Pe(e.feeTierList,(i,V)=>(l(),a("div",{key:V,class:k(e.inputValue.includes(i.label)?"fee-item fee-item-active":"fee-item"),onClick:G=>e.inputValue=i.label},[n("p",null,v(i.title),1),n("span",null,v(i.text),1),n("img",{src:e.importIcon("/image/icon-check@2x.png"),alt:""},null,8,Co)],10,vo))),128))])):m("",!0)]),n("div",go,[n("div",yo,[g(s,{modelValue:e.fromCoinAmount,"onUpdate:modelValue":o[7]||(o[7]=i=>e.fromCoinAmount=i),"input-value":e.fromCoinAmount,"coin-name":e.fromCoin?e.fromCoin.symbol:null,balance:e.fromCoin?e.fromCoin.balance:null,"coin-icon":e.fromCoin?e.fromCoin.icon:"","swap-direction":"From",onOnMax:o[8]||(o[8]=i=>e.maxBtnSelect("fromCoin")),onOnInput:o[9]||(o[9]=i=>e.fromCoinAmount=i),onOnFocus:o[10]||(o[10]=()=>{e.fixedFromCoin=!0}),onOnSelect:o[11]||(o[11]=i=>e.openCoinSelect("fromCoin"))},null,8,["modelValue","input-value","coin-name","balance","coin-icon"])]),n("div",ho,[g(s,{modelValue:e.toCoinAmount,"onUpdate:modelValue":o[12]||(o[12]=i=>e.toCoinAmount=i),"input-value":e.toCoinAmount,"coin-name":e.toCoin?e.toCoin.symbol:"",balance:e.toCoin?e.toCoin.balance:null,"swap-direction":"To","coin-icon":e.toCoin?e.toCoin.icon:"",onOnMax:o[13]||(o[13]=i=>e.maxBtnSelect("toCoin")),onOnInput:o[14]||(o[14]=i=>e.toCoinAmount=i),onOnFocus:o[15]||(o[15]=()=>{e.fixedFromCoin=!1}),onOnSelect:o[16]||(o[16]=i=>e.openCoinSelect("toCoin"))},null,8,["modelValue","input-value","coin-name","balance","coin-icon"])]),e.unilateral?(l(),a("div",So,[n("img",{src:e.importIcon("/image/img-lock@2x.png"),alt:""},null,8,bo),ko])):m("",!0),e.unilateral?m("",!0):(l(),a("img",{key:1,class:"add",src:xe,alt:"",onClick:o[17]||(o[17]=(...i)=>e.toggle&&e.toggle(...i))}))])]),g(f,{disabled:!e.fromCoinAmount||e.clickClear,class:"big-btn",onClick:o[18]||(o[18]=i=>e.isShowLiquidityModal=!0)},{default:J(()=>[Ao,n("span",null,v(e.addLiquidityBtnText),1)]),_:1},8,["disabled"])]),n("div",Po,[n("div",$o,[n("div",wo,[e.fromCoin&&e.toCoin?(l(),a("p",_o,"Current Price")):m("",!0),e.fromCoin&&e.toCoin?(l(),a("div",Mo,"1 "+v((_=e.fromCoin)==null?void 0:_.symbol)+" \u2248 1.00035 "+v((R=e.toCoin)==null?void 0:R.symbol),1)):m("",!0)]),e.fromCoin&&e.toCoin?(l(),a("div",Io,Ro)):m("",!0)]),n("div",Vo,[e.clickClear?(l(),a("img",Eo)):m("",!0)]),n("div",{class:k(e.clickClear?"set-price-mask":"")},null,2),g(I,{min:e.minPrice,max:e.maxPrice,"from-coin":e.fromCoin,"to-coin":e.toCoin,direction:e.direction,"invalid-price-range":e.invalidPriceRange,"default-min-price":e.defaultMinPrice,"default-max-price":e.defaultMaxPrice,onOnChangeMinPrice:e.priceRangeChangeMin,onOnChangeMaxPrice:e.priceRangeChangeMax},null,8,["min","max","from-coin","to-coin","direction","invalid-price-range","default-min-price","default-max-price","onOnChangeMinPrice","onOnChangeMaxPrice"]),e.positionTips?(l(),a("div",Lo,[n("img",{src:e.importIcon("/image/icon-tips@2x.png"),alt:""},null,8,Uo),To])):m("",!0),e.positionError?(l(),a("div",qo,[n("img",{src:e.importIcon("/image/icon-tips-error@2x.png"),alt:""},null,8,Do),Fo])):m("",!0)])]),e.showCoinSelect?(l(),T(B,{key:0,"existing-coins":e.existingCoins,"last-select-coin":e.lastSelectCoin,onOnSelect:e.onCoinSelect,onOnClose:o[19]||(o[19]=i=>e.showCoinSelect=!1)},null,8,["existing-coins","last-select-coin","onOnSelect"])):m("",!0),e.isShowSwapSetting?(l(),T(O,{key:1,onOnClose:o[20]||(o[20]=i=>e.isShowSwapSetting=!1)})):m("",!0),e.isShowLiquidityModal?(l(),T(U,{key:2,onOnClose:o[21]||(o[21]=i=>e.isShowLiquidityModal=!1)})):m("",!0)])}const on=D(Je,[["render",Go],["__scopeId","data-v-43c36ed5"]]);export{on as default};
