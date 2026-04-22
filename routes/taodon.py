from flask import Blueprint, request, jsonify
import random
from extensions import db
from sqlalchemy import text 

taodon_bp = Blueprint('nap', __name__)

@taodon_bp.route('/tao-don-nap', methods=['POST'])
def tao_don_nap():
    data = request.get_json()

    so_tien = int(data.get("so_tien"))
    ma_nguoi_mua = int(data.get("ma_nguoi_mua"))

    # tạo code thanh toán
    code = str(random.randint(10000, 99999))

    # lưu DB
    ma_don = db.session.execute(text("""
        INSERT INTO DonNapTien(ma_nguoi_mua, so_tien, trang_thai, code_thanh_toan)
        OUTPUT INSERTED.ma_don
        VALUES (:ma_nguoi_mua, :so_tien, 'PENDING', :code)
    """), {
        "ma_nguoi_mua": ma_nguoi_mua,
        "so_tien": so_tien,
        "code": code
    }).scalar()

    db.session.commit()

    # nội dung chuyển khoản
    noi_dung = f"NAP {code}"

    # tạo QR VietQR
    qr_url = f"https://img.vietqr.io/image/OCB-SEP0338949568-compact.png?amount={so_tien}&addInfo=NAP%20{code}"
    return jsonify({
        "ma_don": ma_don,
        "noi_dung": noi_dung,
        "qr_url": qr_url
    })