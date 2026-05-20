import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/mock-api";
import { authApi } from "@/lib/api/auth";

type AboutItem = {
    number?: string;
    title: string;
    content: string;
};

type AboutSection = {
    id: number;
    section_key: string;
    title: string;
    content?: string | null;
    items?: AboutItem[] | null;
    sort_order: number;
    is_active: boolean;
};

const getAuthHeaders = () => {
    const currentUser = authApi.getCurrentUser();

    return {
        Authorization: `Bearer ${currentUser?.accessToken}`,
    };
};

export default function AdminAbout() {
    const { toast } = useToast();

    const [sections, setSections] = useState<AboutSection[]>([]);
    const [loading, setLoading] = useState(true);

    const loadSections = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/about-sections`, {
                headers: getAuthHeaders(),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("About sections load failed:", data);
                setSections([]);
                return;
            }

            if (Array.isArray(data)) {
                setSections(data);
            } else if (Array.isArray(data.items)) {
                setSections(data.items);
            } else {
                console.error("Unexpected response:", data);
                setSections([]);
            }
        } catch (error) {
            console.error("About sections load error:", error);
            setSections([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSections();
    }, []);

    const updateSectionField = (
        sectionIndex: number,
        field: keyof AboutSection,
        value: string | number | boolean
    ) => {
        const updated = [...sections];

        updated[sectionIndex] = {
            ...updated[sectionIndex],
            [field]: value,
        };

        setSections(updated);
    };

    const updateItemField = (
        sectionIndex: number,
        itemIndex: number,
        field: keyof AboutItem,
        value: string
    ) => {
        const updated = [...sections];
        const items = [...(updated[sectionIndex].items || [])];

        items[itemIndex] = {
            ...items[itemIndex],
            [field]: value,
        };

        updated[sectionIndex].items = items;
        setSections(updated);
    };

    const addItem = (sectionIndex: number) => {
        const updated = [...sections];
        const section = updated[sectionIndex];
        const items = [...(section.items || [])];

        const nextNumber = `${section.sort_order}.${items.length + 1}`;

        items.push({
            number: nextNumber,
            title: "",
            content: "",
        });

        section.items = items;
        setSections(updated);
    };

    const removeItem = (sectionIndex: number, itemIndex: number) => {
        const updated = [...sections];
        const items = [...(updated[sectionIndex].items || [])];

        items.splice(itemIndex, 1);

        updated[sectionIndex].items = items;
        setSections(updated);
    };

    const saveSection = async (section: AboutSection) => {
        const payload = {
            section_key: section.section_key,
            title: section.title,
            content: section.content || null,
            items: section.items || [],
            sort_order: Number(section.sort_order),
            is_active: section.is_active,
        };

        try {
            const res = await fetch(
                `${API_BASE_URL}/api/admin/about-sections/${section.id}`,
                {
                    method: "PUT",
                    headers: {
                        ...getAuthHeaders(),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                console.error("About section update failed:", data);

                toast({
                    title: "Hata",
                    description: "Bölüm güncellenemedi.",
                    variant: "destructive",
                });

                return;
            }

            toast({
                title: "Kaydedildi",
                description: `${section.title} başarıyla güncellendi.`,
            });

            loadSections();
        } catch (error) {
            console.error("About section update error:", error);

            toast({
                title: "Hata",
                description: "Bölüm güncellenemedi.",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-3xl font-bold">Hakkında CMS</h1>
                <p className="text-muted-foreground mt-1">
                    Hakkında sayfasındaki başlıkları ve alt içerikleri buradan yönetebilirsiniz.
                </p>
            </div>

            {sections.map((section, sectionIndex) => (
                <Card key={section.id}>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between gap-4">
                            <span>
                                {section.sort_order}. {section.title}
                            </span>

                            <div className="flex items-center gap-3">
                                <Switch
                                    checked={section.is_active}
                                    onCheckedChange={(checked) =>
                                        updateSectionField(sectionIndex, "is_active", checked)
                                    }
                                />

                                <Button onClick={() => saveSection(section)}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Kaydet
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        <div className="grid gap-2">
                            <Label>Ana Başlık</Label>
                            <Input
                                value={section.title}
                                onChange={(e) =>
                                    updateSectionField(sectionIndex, "title", e.target.value)
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Sıralama</Label>
                            <Input
                                type="number"
                                value={section.sort_order}
                                onChange={(e) =>
                                    updateSectionField(
                                        sectionIndex,
                                        "sort_order",
                                        Number(e.target.value)
                                    )
                                }
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Alt Başlıklar / İçerikler</Label>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => addItem(sectionIndex)}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Alt İçerik Ekle
                                </Button>
                            </div>

                            {(section.items || []).map((item, itemIndex) => (
                                <div
                                    key={itemIndex}
                                    className="border rounded-lg p-4 space-y-3 bg-muted/30"
                                >
                                    <div className="grid grid-cols-12 gap-3">
                                        <div className="col-span-2">
                                            <Label>No</Label>
                                            <Input
                                                value={item.number || ""}
                                                onChange={(e) =>
                                                    updateItemField(
                                                        sectionIndex,
                                                        itemIndex,
                                                        "number",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="2.1"
                                            />
                                        </div>

                                        <div className="col-span-9">
                                            <Label>Alt Başlık</Label>
                                            <Input
                                                value={item.title}
                                                onChange={(e) =>
                                                    updateItemField(
                                                        sectionIndex,
                                                        itemIndex,
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="col-span-1 flex items-end">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeItem(sectionIndex, itemIndex)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>İçerik</Label>
                                        <Textarea
                                            rows={4}
                                            value={item.content}
                                            onChange={(e) =>
                                                updateItemField(
                                                    sectionIndex,
                                                    itemIndex,
                                                    "content",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}