export const nowTime = (date: Date)=>{
    const offset = 1000 * 60 * 60 * 9
    const koreaNow = new Date(date.getTime() + offset)

    // return koreaNow.toISOString().replace("T", " ").split('.')[0]

    return koreaNow
}

export const filterWithDate = (filter: string)=>{
    if(filter === 'year'){
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return nowTime(oneYearAgo)
    }
    else if(filter ==='month'){
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return nowTime(oneMonthAgo)
    }
    else if(filter ==='week'){
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return nowTime(oneWeekAgo)
    }
}