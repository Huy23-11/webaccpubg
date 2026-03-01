from flask import Flask, render_template
WAG = Flask(__name__)
@WAG.route('/')
def trangchu():
    return render_template('trangchu.html')
@WAG.route('/chitietacc')
def chitietacc():
    return render_template('chitietacc.html')
@WAG.route('/quanlynguoimua')
def quanlynguoimua():
    return render_template('quanlynguoimua.html')
@WAG.route('/quanlyacc')
def quanlyacc():
    return render_template('quanlyacc.html')
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
if __name__ == '__main__':
    WAG.run(debug = True)