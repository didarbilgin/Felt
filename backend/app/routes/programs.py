from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.models.program import Program
from app.schemas.program import ProgramCreate, ProgramOut, ProgramUpdate

router = APIRouter(prefix="/api/admin/programs", tags=["admin:programs"])


@router.get("", response_model=list[ProgramOut])
def list_programs(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return db.query(Program).order_by(Program.created_at.desc()).all()


@router.get("/{program_id}", response_model=ProgramOut)
def get_program(program_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(Program).filter(Program.id == program_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj


@router.post("", response_model=ProgramOut)
def create_program(body: ProgramCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = Program(**body.model_dump(mode="json"))
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{program_id}", response_model=ProgramOut)
def update_program(program_id: UUID, body: ProgramUpdate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(Program).filter(Program.id == program_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")

    for key, value in body.model_dump(exclude_unset=True, mode="json").items():
        setattr(obj, key, value)

    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{program_id}")
def delete_program(program_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(Program).filter(Program.id == program_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")

    db.delete(obj)
    db.commit()
    return {"ok": True}
