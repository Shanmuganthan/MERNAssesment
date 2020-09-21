export default function valueExatractor (data) {
    let res = {};
    let _k = "_value";
     for(let key in data){
        res[key] = [];
       for(let _key in data[key]){
           if(_key == _k){
            res[key] = data[key][_key]     
           }
          
       }
     }
    return res;
}