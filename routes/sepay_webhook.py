from flask import Blueprint, request, jsonify, session
from sqlalchemy import text
import re
from extensions import db
from routes.setvip import setvip

sepay_bp = Blueprint('sepay', __name__, url_prefix='/hooks')

@sepay_bp.route('/sepay-payment', methods=['POST'])
def sepay_webhook():
    data = request.get_json(silent=True)

    if not data:
        return {"error": "no data"}, 400

    print("Webhook:", data)

    amount = int(data.get("transferAmount", 0))
    transaction_id = data.get("referenceCode")
    description = data.get("content", "")

    match = re.search(r'NAP\s*(\d+)', description)

    if not match:
        return {"status": "no code"}, 200

    code = match.group(1)
    print(code,"========================================")

    # 🔥 2. Tìm đơn
    don = db.session.execute(text("""
        SELECT * FROM DonNapTien
        WHERE code_thanh_toan = :code
    """), {"code": code}).fetchone()
    print(don,"==========================================")
    if not don:
        return {"status": "don not found"}, 200

    # 🔥 3. Tránh cộng tiền 2 lần
    if don.trang_thai == 'SUCCESS':
        return {"status": "already processed"}, 200

    # 🔥 4. Check số tiền
    if amount != int(don.so_tien):
        return {"status": "wrong amount"}, 200

    ma_nguoi_mua = don.ma_nguoi_mua
    so_tien = don.so_tien

    # 🔥 5. Lấy số dư hiện tại
    nguoi = db.session.execute(text("""
        SELECT so_du FROM NguoiMua WHERE ma_nguoi_mua = :id
    """), {"id": ma_nguoi_mua}).fetchone()

    so_du_truoc = nguoi.so_du
    so_du_sau = so_du_truoc + so_tien

    # 🔥 6. Update số dư
    db.session.execute(text("""
        UPDATE NguoiMua
        SET so_du = :sau
        WHERE ma_nguoi_mua = :id
    """), {
        "sau": so_du_sau,
        "id": ma_nguoi_mua
    })
    # 🔥 7. Update trạng thái đơn
    db.session.execute(text("""
        UPDATE DonNapTien
        SET trang_thai = 'SUCCESS'
        WHERE ma_don = :ma_don
    """), {
        "ma_don": don.ma_don
    })

    # 🔥 8. Ghi bảng giao dịch
    db.session.execute(text("""
        INSERT INTO GiaoDich(
            ma_giao_dich,
            ma_nguoi_mua,
            ma_acc,
            so_du_truoc,
            so_tien,
            so_du_sau,
            noi_dung,
            loai
        )
        VALUES (
            :ma_gd,
            :ma_nguoi_mua,
            NULL,
            :truoc,
            :so_tien,
            :sau,
            :noi_dung,
            'NAP'
        )
    """), {
        "ma_gd": transaction_id,
        "ma_nguoi_mua": ma_nguoi_mua,
        "truoc": so_du_truoc,
        "so_tien": so_tien,
        "sau": so_du_sau,
        "noi_dung": description
    })

    db.session.commit()

    setvip()

    return {"status": "ok"}, 200