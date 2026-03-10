from flask import Blueprint, request, render_template, session
from sqlalchemy import text
from extensions import db

dangnhap_bp = Blueprint("dangnhap_bp", __name__)

@dangnhap_bp.route('/dangnhap')
def trang_dangnhap():
    return render_template('dangnhap.html')

@dangnhap_bp.route("/dangnhap", methods=["POST"])
def dangnhap():
    data = request.get_json()
    taikhoan = data.get("tai_khoan")
    matkhau = data.get("mat_khau")
    sql = """
    SELECT ma_nguoi_mua, ten, so_du
    FROM NguoiMua
    WHERE tai_khoan = :tk
    AND mat_khau = :mk
    """
    user = db.session.execute(
        text(sql),
        {"tk": taikhoan, "mk": matkhau}
    ).fetchone()
    if user:
        session["ma_nguoi_mua"] = user.ma_nguoi_mua
        session["ten"] = user.ten
        session["so_du"] = float(user.so_du)
        return {"status": "success"}
    return {"status": "fail"}