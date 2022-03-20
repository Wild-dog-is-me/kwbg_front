<template>
  <div class="body_container">

    <div class="head_container">
      <!--分页控件-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[8, 16, 32, 64, 128]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageObj.total"
              size="small">
      </el-pagination>

      <!--头部搜索区域-->
      <div>
        <el-input @keydown.enter.native="handleSearch" v-model="searchObj.name" prefix-icon="el-icon-user" style="width: 200px" placeholder="输入姓名进行查询" size="small"/>
        <el-input @keydown.enter.native="handleSearch" v-model="searchObj.username" prefix-icon="el-icon-user-solid" style="width: 200px;margin-left: 10px" placeholder="输入登录名称进行查询" size="small"/>
        <el-button @click="handleSearch" icon="el-icon-search" type="primary" size="small" style="margin-left: 10px" class="change_btn">搜索</el-button>
        <el-button @click="handleClear" icon="el-icon-refresh-right" type="primary" size="small" class="change_btn">重置</el-button>
      </div>
    </div>

    <!--中间数据内容区域-->
    <div v-if="!cardsLoad" class="cardsUnLoad">
      <i class="el-icon-loading"/>
    </div>

    <div v-else class="card_container">
      <span v-if="pageObj.total <= 0" style="color: grey;margin-top: 30px">暂 无 数 据</span>
      <el-card v-else class="box-card" v-for="(item,i) in allAdminsData" :key="i">
        <div slot="header" class="clearfix">
          <span>{{item.name}}</span>
          <span style="font-size: 12px;color: grey;margin-left: 5px">({{item.username}})</span>
          <el-popconfirm
                  @confirm="handleDelete(item)"
                  :title="'确定移除['+ item.name +']吗？'">
            <el-button slot="reference" style="float: right; padding: 3px 0;color: #FF4949" :title="'移出名称为'+ item.name +'的所有数据信息'" type="text" icon="fa fa-trash"/>
          </el-popconfirm>

        </div>
        <!--卡片内容-->
        <div>
          <!--用户头像-->
          <div class="demo-type card_avatar">
            <span style="color:gray;font-size: 14px">{{item.age}}<span style="font-size: 12px;margin-left: 3px">岁</span></span>
            <el-avatar :size="50" src="https://portrait.gitee.com/uploads/avatars/user/2813/8441097_shaynas_1610801433.png!avatar200" @error="() => true" :title="item.name" style="cursor: pointer">
              <img :src="item.userFace"/>
            </el-avatar>
            <span :style="{'color' : item.gender == 1 ? '#409EFF' : 'pink'}" :class="item.gender==1?'el-icon-male':'el-icon-female'"></span>
          </div>
          <ul class="card_detail_ul">
            <li>
              <span>状态：</span>
              <el-tooltip :content="'当前状态: ' + item.enabled" placement="top">
                <el-switch
                        @change="switchChange(item)"
                        v-model="item.enabled"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                </el-switch>
              </el-tooltip>

            </li>
            <li><span>电话：</span><span>{{item.telephone}}</span></li>
            <li><span>地址：</span><span>{{item.address}}</span></li>
            <li style="margin-top: 10px;display: flex;justify-content: space-between">
              <span>角色：</span>
              <el-popover
                      v-if="item.roles.length > 0"
                      placement="top"
                      :title="item.name +'所拥有的角色:'"
                      width="200"
                      trigger="hover"
                      style="cursor: pointer">
                <el-tag v-for="(role,j) in item.roles" size="small" :key="j" style="font-size:12px;margin-right:5px;color:blueviolet;">{{role.name}}</el-tag>
                <div slot="reference" style="display: inline-block">
                  <i  class="fa el-icon-more" style="margin-top: 2px"/>
                </div>
              </el-popover>
              <span v-else>暂无</span>

              <el-popover
                      placement="left"
                      :title="'正在给'+ item.name +'编辑角色:'"
                      width="200"
                      @show="showRoleSelector(item)"
                      @hide="hideRoleSelector(item)"
                      trigger="click">
                <el-select
                        multiple
                        v-model="haveRoleList"
                        @change="changeSelector"
                        placeholder="点击添加角色">
                  <el-option
                          v-for="(r,i) in roleList"
                          :key="i"
                          :label="r.name"
                          :value="r.id"
                          :disabled="!r.enabled">
                  </el-option>
                </el-select>
                <i class="el-icon-edit" slot="reference" style="color: #409EFF;cursor: pointer" title="编辑角色"/>
              </el-popover>


              <!--<el-tag type="success" v-for="(role,j) in item.roles" size="small" :key="j" style="font-size:12px;margin-right:5px;color:blueviolet;">{{role.name}}</el-tag>-->

            </li>
          </ul>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SysAdmin",
    data(){
      return {
        //卡片加载
        cardsLoad: false,
        //admin集合数据
        allAdminsData: [],
        //搜索对象
        searchObj:{
          name: '',
          username: ''
        },
        optionObj:{
          name: '',
          username: ''
        },
        //所有角色集合
        roleList: [],
        //拥有的角色集合
        haveRoleList: [],
        //是否改变了角色选择器数据
        isSelectorChange: false,
        tempRoleList: [],
        //分页对象
        pageObj: {
          //当前第几页
          page: 1,
          //每页显示多少条
          size: 8,
          //总记录数
          total: 0,
        },
      }
    },
    mounted() {
      this.loadAdminData();
    },
    methods:{
      //加载数据
      loadAdminData(){
        this.cardsLoad = false;
        this.getRequest('/system/admin/?page=' + this.pageObj.page + '&size=' + this.pageObj.size + '&name=' + this.searchObj.name + '&username=' + this.searchObj.username).then(resp => {
          if(resp){
            this.allAdminsData = resp.data;
            this.pageObj.total = resp.count;
            this.cardsLoad = true;
          }
        })
      },
      //处理搜索按钮点击事件
      handleSearch(){
        this.loadAdminData();
      },
      //搜索条件清空事件
      handleClear(){
        this.searchObj.name = '';
        this.searchObj.username = '';
        this.loadAdminData();
      },

      //修改用户状态
      switchChange(data){
        this.putRequest('/system/admin/?id='+ data.id + '&enabled=' + data.enabled).then(resp => {
          if(!resp){
            //修改异常，数据回调
            data.enabled = !data.enabled;
          }
        })
      },
      //查询所有角色信息
      showRoleSelector(data){
        this.isSelectorChange = false;
        //显示用户拥有的角色
        this.haveRoleList = [];
        for(let r of data.roles){
          this.haveRoleList.push(r.id);
        }
        this.getRequest('/system/admin/roles').then(resp => {
          if(resp){
            this.roleList = resp;
            this.tempRoleList = resp;
          }
        })
      },
      //保存用户角色
      hideRoleSelector(data){
        //选中值发生变化则保存数据
        if(this.isSelectorChange){
          //执行保持角色操作
          let url = '/system/admin/role?id=' + data.id;
          //拼接rids
          for(let id of this.haveRoleList){
            url += '&rids=' + id;
          }
          this.putRequest(url).then(resp => {
            if(resp){
              this.loadAdminData();
            }else{
              //失败则数据回显为打开选择器时的数据
              this.haveRoleList = this.tempRoleList;
            }
          })
        }
      },
      //选中值发生变化时触发
      changeSelector(data){
        this.isSelectorChange = true;
      },
      //处理删除
      handleDelete(data){
        this.deleteRequest('/system/admin/' + data.id).then(resp => {
          if(resp){
            this.loadAdminData();
          }
        })
      },
      //分页处理
      handleSizeChange(size){
        this.pageObj.size = size;
        this.loadAdminData();
      },
      handleCurrentChange(currentPage){
        this.pageObj.page = currentPage;
        this.loadAdminData();
      },
    }
  }
</script>

<style scoped>
  /*主容器*/
  .body_container{
    overflow: auto;
  }

  /*数据头部（分页，搜索条件）内容*/
  .head_container{
    display: flex;
    justify-content: space-between;
    padding: 0 5px;
  }

  /*卡片未加载出来的样式*/
  .cardsUnLoad{
    text-align: center;
    font-size: 30px;
    padding-top: 40px;
  }
  /*按钮位置微调*/
  .change_btn{
    position: relative;
    top: -1px;
  }

  /*卡片组主容器*/
  .card_container{
    overflow: auto;
    margin-top: 15px;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  /*卡片样式*/
  .box-card{
    width: 300px;
    margin-bottom: 8px;
  }
  /*头像容器*/
  .card_avatar{
    display: flex;
    justify-content: space-between;
  }
  /*头像左右侧文字*/
  .card_avatar span{
    line-height: 50px;
  }

  /*详情信息ul*/
  .card_detail_ul{
    list-style: none;
    padding: 0;
    margin: 15px 0 0 0;
  }

  .card_detail_ul li{
    margin-bottom: 10px;
  }

  .card_detail_ul li:last-child{
    margin-bottom: 0;
  }

  .card_detail_ul span:nth-of-type(1){
    color: #606266;
  }

  .card_detail_ul span:nth-of-type(2){
    font-size: 14px;
    color: grey;
  }
</style>
