from flask import Flask, render_template
from extensions import db, socketio
from config import Config
from flasgger import Swagger

from routes.sepay_webhook import sepay_bp
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
from routes.xoaacc import xoaacc_bp
from routes.themacc import themacc_bp
from routes.suatrangthaiacc import suatrangthaiacc_bp
from routes.hienthichitietacc import hienthichitietacc_bp
from routes.congsoluotxem import congsoluotxem_bp
from routes.muaacc import muaacc_bp
from routes.themgiohang import themgiohang_bp
from routes.taodon import taodon_bp
from routes.lichsugiaodich import lichsugiaodich_bp
from routes.suaanhchinh import suaanhchinh_bp
from routes.adminlsgiaodich import adminlsgiaodich_bp
from routes.setvip import setvip_bp

WAG = Flask(__name__)
WAG.config.from_object(Config)

WAG.config["SECRET_KEY"] = "shopaccgame123"

db.init_app(WAG)
socketio.init_app(WAG)

# Swagger config
swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "Shop Acc Game API",
        "description": "API quản lý shop acc",
        "version": "1.0"
    },

    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "Nhập JWT dạng: Bearer <token>"
        }
    },

    "security": [
        {
            "Bearer": []
        }
    ]
}

swagger = Swagger(WAG, template=swagger_template)


WAG.register_blueprint(sepay_bp)
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
WAG.register_blueprint(xoaacc_bp)
WAG.register_blueprint(themacc_bp)
WAG.register_blueprint(suatrangthaiacc_bp)
WAG.register_blueprint(hienthichitietacc_bp)
WAG.register_blueprint(congsoluotxem_bp)
WAG.register_blueprint(muaacc_bp)
WAG.register_blueprint(themgiohang_bp)
WAG.register_blueprint(taodon_bp)
WAG.register_blueprint(lichsugiaodich_bp)
WAG.register_blueprint(suaanhchinh_bp)
WAG.register_blueprint(adminlsgiaodich_bp)
WAG.register_blueprint(setvip_bp)

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