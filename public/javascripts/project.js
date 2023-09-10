$(document).ready(function(){
    $.getJSON("/product/fetch_product_type", function(data){
        var data = data.result;
        // alert(JSON.stringify(data))
        data.map((item,i)=>{
            $('#producttypeid').append($('<option>').text(item.producttypename).val(item.producttypeid))
        })
    })

    $('#producttypeid').change(function(){
        $.getJSON("/product/fetch_product_category",{typeid:$('#producttypeid').val()},function(data){
            var data = data.result;
            $('#productcategoryid').empty();
            $('#productcategoryid').append($('<option>').text('-Select Category-'));
            data.map((item,i)=>{
                $('#productcategoryid').append($('<option>').text(item.productcategoryname).val(item.productcategoryid))
            })
        })
    })

    $.getJSON("/admin/count_electrical_products",function(data){
        var data=data.result
        var htm=":"+data.e
        $("#cn_e").html(htm)
    })
    $.getJSON("/admin/count_securitycamera_products",function(data){
        var data=data.sc
        console.log("data:",data.sc)
        $("#cn_sc").html(`:${data.sc}`)
    })
    $.getJSON("/admin/count_furniture_products",function(data){
        var data=data.f
        var htm=":"+data.f
        $("#cn_f").html(`:${data.f}`)
    })

})



// $.getJSON("server action",{parameters},function(data){

// })