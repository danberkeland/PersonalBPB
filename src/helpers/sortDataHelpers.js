export const sortAtoZDataByIndex = (data,index) => {
    data.sort(function(a,b){return a[index]>b[index] ? 1 : -1;})
}