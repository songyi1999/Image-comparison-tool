<template>
  <div class="index_mymain">
    <div>
      <input id="fileselect1" type="file" name="fileselect1" style="display:none;">
      <input id="fileselect2" type="file" name="fileselect2" style="display:none;">
      <el-select v-model="currentdir" placeholder="选择分类">
        <el-option v-for="(p,k) in dir" :key="k" :value="p"/>
      </el-select>
      <el-select v-if="currentdir" v-model="currentfilebasename" placeholder="选择文件">
        <el-option v-for="(p,k) in subdir" :key="k" :value="p"/>
      </el-select>

      <el-button type="primary" @click="test">查看</el-button>

    </div>
    <div class="index_bg" @mouseup="mouseup">

      <vueCropper
        ref="cropper"

        :output-type="option.outputType"
        :can-scale="false"
        :fixed="true"
        :center-box="true"
        :img="currentfile||'/soft/图片放大效果/static/source.png'"
        @realTime="realTime"

      />
    </div>
    <div class="pre">
      <section class="pre-item" title="">
        <p>HR</p>
        <div id="cp1" :style="previewStyle3">
          <div :style="previews.div">
            <img :src="previews.url" :style="previews.img">
          </div>
        </div>
      </section>
      <section v-for="(p,k) in currentfiles" :key="k" class="pre-item" title="">
        <p>{{ k+1 }}x</p>
        <div :style="previewStyle3">
          <div :style="previews.div">
            <img :style="previews.img" :src="p||'/soft/图片放大效果/static/pesr.png'">
          </div>
        </div>
      </section>
    </div>
    <!-- <section>
      <div class="cp">
        <img :src="cp" alt="">
      </div>
    </section>
    <section>
      <div class="cp1">
        <img :src="cp1" alt="">
      </div>
    </section> -->
  </div>
</template>
<script>
// import html2canvas from 'html2canvas'
import { VueCropper } from 'vue-cropper'
import { dir } from './dir'
export default {
  components: {
    VueCropper
  },
  data() {
    return {
      basedir: 'https://www.sz-hgy.com/soft/图片放大效果/test/',
      dirtree: {},
      dir: [], // 目录
      file: [], // 文件名
      currentdir: '',
      currentfilebasename: '',
      currentfiles: [],
      currentfile: '',

      cp: '',
      cp1: '',
      file1: '',
      file2: '',
      option: {

        outputType: 'png'
      },
      previews: {},
      previewStyle3: {}
    }
  },
  computed: {
    subdir() {
      const arr = this.dirtree[this.currentdir].split(' ').filter(x => x)
      console.log(arr)
      return arr

      // console.log(this.dir[this.currentdir])
      // return ''
    }
  },
  mounted() {
    const app = this
    this.dirtree = dir
    for (const key in this.dirtree) {
      this.dir.push(key)
    }
    console.log(this.dir)
    this.$nextTick(() => {
      app.$refs.cropper.startCrop()
    })
    document.getElementById('fileselect1').addEventListener('change', function(e) {
      var file = event.target.files[0]
      file.crossOrigin = 'anonymous'
      var reader = new FileReader()

      reader.onload = function(event) {
        // console.log(event.target.result)
        app.file1 = event.target.result
      }

      reader.readAsDataURL(file)
    })
    document.getElementById('fileselect2').addEventListener('change', function(e) {
      var file = event.target.files[0]
      file.crossOrigin = 'anonymous'
      var reader = new FileReader()

      reader.onload = function(event) {
        // console.log(event.target.result)
        app.file2 = event.target.result
      }

      reader.readAsDataURL(file)
    })
  }, methods: {
    test() {
      const list = []
      console.log(this.currentdir, this.currentfilebasename)
      this.currentfile = this.basedir + '/' + this.currentdir + '/HR/' + this.currentfilebasename
      const namearr = this.currentfilebasename.split('.')
      for (let i = 1; i < 8; i++) {
        list.push(this.basedir + '/' + this.currentdir + '/x' + i + '/' + namearr[0] + '_bicLRx4.' + namearr[1])
      }
      this.currentfiles = list.slice(0)
    },
    mouseup() {
      // const app = this
      // html2canvas(document.querySelector('.vue-cropper'), { allowTaint: true }).then(canvase => {
      //   app.cp = canvase.toDataURL()
      // })
      // html2canvas(document.querySelector('#cp1'), { scale: 30, allowTaint: true }).then(canvase => { //
      //   app.cp1 = canvase.toDataURL()
      // })
    },

    realTime(data) {
      var previews = data

      this.previewStyle3 = {
        width: previews.w + 'px',
        height: previews.h + 'px',
        overflow: 'hidden',
        margin: '0',
        zoom: (200 / previews.w)
      }

      this.previews = data
    }
  }
}
</script>
<style scoped>
.cropper-face{
  opacity: 0 !important;
}
.pre {
	display: flex;
  flex-wrap: wrap;
}
.pre-item {
	padding-right: 20px;
}
.index_bg  {
  width: 400px;
  height: 400px;
}
.cp{
  position:absolute;
  top:100px;
  left:500px;
  width:300px;
  height:300px;
}
.cp img{
  width:100%;
}
.cp1{
  width:200px;
  height: 200px;
}
.cp1 img{
  width:100%;
}
</style>
<style >
.cropper-view-box{
  outline-color: rgb(255, 0, 0)!important;
}
.crop-info{
  display: none !important;

}
.crop-point, .cropper-modal{
  display:none !important;
}

</style>
