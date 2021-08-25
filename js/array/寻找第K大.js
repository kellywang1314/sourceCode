// 复杂度是o(n)
function findKth( a ,  n ,  K ) {
    // write code here
    return quickSort(a,0,n-1,K)
}

function quickSort(a, low, high,K){
    let p = partion(a,low,high)
    if(p-low+1 === K){
        return a[p]
    }else if(p-low+1 > K){
        return quickSort(a,low,p-1,K)
    }else{
        return quickSort(a,p+1,high,K-(p-low+1))
    }
    
}

function partion(a,low,high){
    let temp = a[low];
    while(low < high){
            while(low < high && a[high] <= temp)
                high--;
                a[low] = a[high];
            while(low < high && a[low] >= temp)
                low++;
                a[high] = a[low];
        }
        a[low] = temp;
        return low;
}