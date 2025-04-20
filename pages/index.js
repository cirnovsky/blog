import Head from "next/dist/shared/lib/head";
import Layout, { siteTitle } from "../components/Layout";
import { Sections } from "../lib/enums";

export default function Home() {
  return (
    <Layout section={Sections.HOME}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className="mx-auto">
        <p><del>简介还没写，路尚漫漫，还待写就。</del></p>
	  <p>先写一点吧。一条川渝混血咸鱼。不吃辣。浪掷五年于信息竞赛，换来赤裸的身体与坚定的心。摇滚热，V 家粉，不通音律。乒乓迷，底板碳素 190，双面反胶，正手省狂，反手白金，直横混打。半吊子足球运动员，因膝部伤病引退。两年半的高中语文学习给我留下最深印象的词是《鹧鸪天·西都作》</p>
<div style={{ writingMode: "vertical-rl", marginLeft: "auto", marginRight: "auto" }}>
<p>《鹧鸪天·西都作》</p>
<p>—— 朱敦儒</p>
<p>我是清都山水郎，天教分付与疏狂。</p>
	  <p>曾批给雨支风券，累上留云借月章。</p>
	  <p>诗万首，酒千觞。几曾着眼看侯王？</p>
	  <p>玉楼金阙慵归去，且插梅花醉洛阳。</p>
</div>
      </div>
    </Layout>
  );
}
