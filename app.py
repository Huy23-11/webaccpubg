from flask import Flask, render_template
from extensions import db, socketio
from config import Config
from routes.suatrangthaitimkiemacc import suatrangthaitimkiemacc_bp
from routes.dsacc_quanlyacc import quanlyacc
from routes.xoaanhacc import xoaanhacc_bp
from routes.hienthianhacc import hienthianhacc_bp
from routes.suaacc import suaacc_bp
from routes.dsnguoimua import dsnguoimua_bp
from routes.xoanguoimua import xoanguoimua_bp
from routes.suanguoimua import suanguoimua_bp
from routes.doanhthu import doanhthu_bp
from routes.hienthitrangchu import hienthitrangchu_bp
from routes.dangnhap import dangnhap_bp
from routes.dangxuat import dangxuat_bp
from routes.dangky import dangky_bp
from routes.lichsumuaacc import lichsumuaacc_bp
from routes.giohang import giohang_bp
from routes.trangnaptien import trangnaptien_bp

WAG = Flask(__name__)
WAG.config.from_object(Config)
db.init_app(WAG)
socketio.init_app(WAG)
WAG.register_blueprint(quanlyacc)
WAG.register_blueprint(xoaanhacc_bp)
WAG.register_blueprint(hienthianhacc_bp)
WAG.register_blueprint(suaacc_bp)
WAG.register_blueprint(suatrangthaitimkiemacc_bp)
WAG.register_blueprint(dsnguoimua_bp)
WAG.register_blueprint(xoanguoimua_bp)
WAG.register_blueprint(suanguoimua_bp)
WAG.register_blueprint(doanhthu_bp)
WAG.register_blueprint(hienthitrangchu_bp)
WAG.register_blueprint(dangnhap_bp)
WAG.register_blueprint(dangxuat_bp)
WAG.register_blueprint(dangky_bp)
WAG.register_blueprint(lichsumuaacc_bp)
WAG.register_blueprint(giohang_bp)
WAG.register_blueprint(trangnaptien_bp)

WAG.secret_key = "shopaccgame123"

@WAG.route('/chitietacc')
def chitietacc():
    return render_template('chitietacc.html')
@WAG.route('/quanlynguoimua')
def quanlynguoimua():
    return render_template('quanlynguoimua.html')
@WAG.route('/doanhthu')
def doanhthu():
    return render_template('doanhthu.html')
@WAG.route('/doimatkhau')
def doimatkhau():
    return render_template('doimatkhau.html')
print(Config.SQLALCHEMY_DATABASE_URI)
if __name__ == '__main__':
    socketio.run(WAG, debug=True)