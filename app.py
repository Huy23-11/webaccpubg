from flask import Flask, render_template
from extensions import db
from config import Config
from routes.lienketanh_acc import lienketanh_acc
from routes.dsacc_quanlyacc import quanlyacc
from routes.xoaanhacc import xoaanhacc_bp
from routes.hienthianhacc import hienthianhacc_bp
from routes.suaacc import suaacc_bp

WAG = Flask(__name__)
WAG.config.from_object(Config)
db.init_app(WAG)
WAG.register_blueprint(lienketanh_acc)
WAG.register_blueprint(quanlyacc)
WAG.register_blueprint(xoaanhacc_bp)
WAG.register_blueprint(hienthianhacc_bp)
WAG.register_blueprint(suaacc_bp)
@WAG.route('/')
def trangchu():
    return render_template('trangchu.html')
@WAG.route('/chitietacc')
def chitietacc():
    return render_template('chitietacc.html')
@WAG.route('/quanlynguoimua')
def quanlynguoimua():
    return render_template('quanlynguoimua.html')
@WAG.route('/doanhthu')
def doanhthu():
    return render_template('doanhthu.html')
@WAG.route('/giohang')
def giohang():
    return render_template('giohang.html')
@WAG.route('/lichsumuaacc')
def lichsumuaacc():
    return render_template('lichsumuaacc.html')
@WAG.route('/dangnhap')
def dangnhap():
    return render_template('dangnhap.html')
@WAG.route('/dangky')
def dangky():
    return render_template('dangky.html')
@WAG.route('/trangnaptien')
def trangnaptien():
    return render_template('trangnaptien.html')
@WAG.route('/doimatkhau')
def doimatkhau():
    return render_template('doimatkhau.html')
print(Config.SQLALCHEMY_DATABASE_URI)
if __name__ == '__main__':
    WAG.run(debug = True)