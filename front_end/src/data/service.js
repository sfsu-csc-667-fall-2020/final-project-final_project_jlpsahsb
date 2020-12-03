const data={
    "itemName": "New Bicycle",
"picture": "https://menafn.com/updates/pr/2020-02/18/i_c59db84e-0image_story.jpg",
"description": "Brand new bike. My son no longer needs it.",
"price": 85,
}
const myData=[{
    'catgName':'Activities',
    'data':[data,data,data,data]
},
{
    'catgName':'Services',
    'data':[data,data,data]
},
{
    'catgName':'Housing',
    'data':[data,data,data,data,data,data,data,data]
},{
    'catgName':'Jobs',
    'data':[data,data,data,data]
},
{
    'catgName':'Gigs',
    'data':[data,data,data]
}
]
export default class{
    static getData=()=>{
        return myData
    }
}