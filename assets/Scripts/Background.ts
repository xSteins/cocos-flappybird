import { _decorator, Component, Node, UITransform, Vec3 } from 'cc'
const { ccclass, property } = _decorator

@ccclass('Background')
export class Background extends Component {
  //buat edit kecepatan via cocos GUI sblum diatur lewat gamecontroller
  @property({ type: Number })
  public speed: number = 100
  public backgroundWidth: number = -144;

  // marker koordinat ground
  

  start () {
    // hitung posisi ukuran
    this.backgroundWidth = this.calculateTotalWidth()
  }

  update (deltaTime: number) {
    this.node.translate(new Vec3(-this.speed * deltaTime, 0, 0))
    // console.log('Timing : ' + this.node.position.x)
    // kalo node sudah hampir habis, cek juga this.node.position gak boleh kurang dari lebar elemen bgnya
    if (this.node.position.x <= (-this.backgroundWidth/2 + this.backgroundWidth) *-1) {
      console.log(this.backgroundWidth);
      this.node.translate(new Vec3(275, 0, 0))
    //   this.node.translate(new Vec3(-this.backgroundWidth, 0, 0))
    }
  }
  // komponen reusable untuk dynamic movement update supaya tidak kepotong2
  private calculateTotalWidth (): number {
    let totalWidth = 0;
    const children = this.node.children;
    for (let child of children) {
      totalWidth += child.getComponent(UITransform).width;
    }
    return totalWidth
  }
}
