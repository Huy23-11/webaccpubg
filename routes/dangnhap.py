from flask import Blueprint, request, render_template, session, current_app
from sqlalchemy import text
from extensions import db
import jwt
from datetime import datetime, timedelta

dangnhap_bp = Blueprint("dangnhap_bp", __name__)

def _create_jwt(payload: dict, expires_minutes: int = 60):
    payload = payload.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=expires_minutes)
    return jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")

@dangnhap_bp.route('/dangnhap')
def trang_dangnhap():
    return render_template('dangnhap.html')

@dangnhap_bp.route("/dangnhap", methods=["POST"])
def dangnhap():
    """
    Đăng nhập user hoặc admin
    ---
    tags:
      - Auth
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            tai_khoan:
              type: string
              example: admin
            mat_khau:
              type: string
              example: 123456
    responses:
      200:
        description: Login result
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
    """
    data = request.get_json()
    taikhoan = data.get("tai_khoan")
    matkhau = data.get("mat_khau")
    sql = """
    SELECT ma_nguoi_mua, ten, so_du, vip
    FROM NguoiMua
    WHERE tai_khoan = :tk
    AND mat_khau = :mk
    """
    user = db.session.execute(
        text(sql),
        {"tk": taikhoan, "mk": matkhau}
    ).fetchone()
    if user:
        session["role"] = "nguoimua"
        session["ma_nguoi_mua"] = user.ma_nguoi_mua
        session["ten"] = user.ten
        session["so_du"] = float(user.so_du)
        session["vip"] = user.vip
        token = _create_jwt({"role": "nguoimua", "ma_nguoi_mua": user.ma_nguoi_mua})
        return {"status": "success", "token": token}
    
    sql2 = """
        SELECT * 
        FROM ChuShop cs
        WHERE cs.tai_khoan = :tk AND cs.mat_khau = :mk
    """
    admin = db.session.execute(text(sql2),{"tk":taikhoan, "mk": matkhau}).fetchone()
    if admin:
        session["role"] = "admin"
        token = _create_jwt({"role": "admin", "tai_khoan": taikhoan})
        return {"status": "success2", "token": token}
    
    return {"status": "fail"}

@dangnhap_bp.route("/session-info")
def session_info():
    """
    Xem session hiện tại
    ---
    tags:
      - Auth
    responses:
      200:
        description: session data
    """
    return dict(session)