from extensions import db
from sqlalchemy import text
from flask import Blueprint

setvip_bp = Blueprint("setvip", __name__)

@setvip_bp.route("/setvip")
def setvip():
    sql = """
        update NguoiMua 
        set vip = 1
        where vip = 0 and ma_nguoi_mua in(
            select ma_nguoi_mua
            from DonNapTien
            where trang_thai = 'SUCCESS'
            group by ma_nguoi_mua
            having sum(so_tien) >= 55000000
        )
    """
    db.session.execute(text(sql))
    db.session.commit()
    return {"status": "success"}