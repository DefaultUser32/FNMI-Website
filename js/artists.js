// Updated artist data structure with parsed fields from DATA.txt
const artists = [
    {
        id: "kent_monkman",
        name: "Kent Monkman",
        pronouns: "He/Him",
        birthYear: 1965,
        identity: "Cree",
        specificIdentity: "Fisher River Cree Nation",
        image: "Kent_Monkman.png",
        background: "Manitoba.png",
        links: [
            { type: "website", url: "https://www.kentmonkman.com/" },
            { type: "youtube", url: "https://www.youtube.com/channel/UCbFR-uB2GIbTKm0pjNhlSzg" },
            { type: "instagram", url: "https://www.instagram.com/kentmonkman/?hl=en" }
        ],
        bio: "Kent Monkman is a celebrated Cree artist living between Toronto and New York. His work reclaims the classic historical style painting, subverting misconceptions through striking visuals, gender subversion, and humor. His works often feature his Two-Spirit alter ego Miss Chief Eagle Testickle. His awards include the Officer of the Order of Canada (2023), his works have featured in major museums such as the Met and Denver Art Museum.",
        works: [
            {
                title: "Mistikôsiwak (Wooden Boat People)",
                year: 2020,
                medium: "Acrylic on canvas (diptych - two separate paintings hung together)",
                description: "Mistikôsiwak was commissioned by the Metropolitan Museum of Art for its Great hall. The paintings reimagine European conquest from an Indigenous perspective. It subverts the traditional narrative, placing the Indigenous paddlers in control, asserting agency and resilience.",
                impact: "This diptych (set of paintings) has become a landmark piece in Indigenous representation. It is celebrated for being acquired by the Met, thereby claiming space in a prestigious and dominant museum space. It triggered a shift in how art venues consider what stories they choose to uplift, and sparked conversation in the decolonization of art history.",
                link: "https://www.metmuseum.org/press-releases/kent-monkman-acquisition-2020-news"
            }
        ]
    },
    {
        id: "nyle_johnston",
        name: "Nyle Miigizi Johnston",
        pronouns: "He/Him",
        birthYear: 1990,
        identity: "Anishinaabe",
        specificIdentity: "Chippewas of Nawash Unceded First Nation",
        image: "Nyle_Johnston.png",
        background: "Ontario.png",
        links: [
            { type: "website", url: "https://miigizi.com/" },
            { type: "instagram", url: "https://www.instagram.com/miigizi/" },
            { type: "x", url: "https://x.com/miigizi" }
        ],
        bio: "Nyle Miigizi Johnston is a neurodivergent Anishinaabe Visual Storyteller, muralist, Oshkaabewis (traditional helper), and Cultural Director at Finding Our Power Together. Known by his spirit name Wiishkoonseh Miigizi'enh (“Whistling White-Headed Eagle”), he apprenticed with Elders and Storytellers in his youth. His work is deeply inspired by Woodland Artists, a group primarily composed of indigenous artists from the great lakes region. His works contain universal themes of love, care, humility, and connection. His art has featured at the Art Gallery of Ontario, Royal Ontario Museum, MacLaren Art Center, and across a variety of public spaces in toronto.",
        works: [
            {
                title: "Diiyah Muh'gaanag (Our First Family)",
                year: 2018,
                medium: "Oil on vinyl & cut vinyl",
                description: "The mural depicts a vibrant world of spiritual beings: plants, animals, and celestial bodies. It contains layers of symbols to communicate themes of connection. These symbols include the wolf (loyalty), water lily (overcoming challenges in life), and star systems (spiritual connection).",
                impact: "With its position in a public art gallery, Our First Family has made strides in advancing public knowledge of Indigenous visual storytelling. It was praised for deepening the understanding of Anishinaabe cosmology worldwide."
            },
            {
                title: "Let Us Not Forget About the Little People",
                medium: "Public mural",
                description: "This piece was installed across nearly 2000 sq ft in Toronto. It honors and celebrates the children of the Chippewas of Nawash. The artist focuses on children as the caretakers of culture; calling upon them as the future of land and identity. Through playful imagery, he calls on viewers to remember and uphold the tenets of intergenerational healing.",
                impact: "This piece is seen by thousands of people each day, an undoubtable and unmistakable presence in Toronto's urban space. It serves as a powerful reminder to protect the beautiful lands upon which we live. With each passing moment it inspires dialogue and cultural resurgence."
            }
        ]
    },
    {
        id: "amy_malbeuf",
        name: "Amy Malbeuf",
        pronouns: "She/Her",
        birthYear: 1987,
        identity: "Métis",
        specificIdentity: "Rich Lake, Alberta",
        image: "Amy_Malbeuf.png",
        background: "Alberta.png",
        links: [
            { type: "website", url: "https://amymalbeuf.ca/" },
            { type: "instagram", url: "https://www.instagram.com/amy.malbeuf/?hl=en" }
        ],
        bio: "A multidisciplinary artist, she has practiced in beadwork, installation, tattooing, caribou/moose hair tufting, and sculpture. She explores themes of identity, language, and land/ecology. Her work draws from techniques learned by Metis mentors, using her deeply physical and tactile work to dismantle settler misconceptions. With her Masters in Fine Arts from UBC Okanagan, she has received numerous honours including the 2016 Lieutenant Governor of Alberta Emerging Artist Award, the Hnatyshyn Foundation's Saunderson Prize, and a long-listing for the Sobey Art Award.",
        works: [
            {
                title: "ᐃᐢᑯᑌᐤ (Iskotew)",
                year: 2018,
                medium: "Painted steel sculpture",
                description: "The name of the piece is the Cree word for fire, written in Nehiyawewin syllabics. The name plays on the phonetic functions of the language, sounding similar to 'iskwew', the word for woman. It calls upon the sacred strength of Indigenous women, and claims physical presence and space for the language.",
                impact: "The piece affirms cultural identity for Metis and Cree cultures. It demonstrates resilience and cultural force, reinforcing upon cultural continuity. It shows the power of Indigenous culture and language to persevere through oppression."
            },
            {
                title: "Kahkiyaw kikway (All of Everything)",
                year: 2019,
                medium: "Tanned hide sculptures & wearables",
                description: "These works were first presented at the Toronto Biennial and Arsenal Contemporary. The collection explores the ideas of inclusivity and cultural embodiment. The wearables were designed to accommodate a range of genders and body types. This was done in contrast to the typical rigid art wearables of the western world.",
                impact: "Through the ability to wear the art, her collection allows embodied participation and reflection in the context and importance of FNMI cultural clothing. It sparked conversation over how fashion, gender, and language factor into the world."
            }
        ]
    },
    {
        id: "jay_soule",
        name: "Jay Soule (Chippewar)",
        pronouns: "He/Him",
        birthYear: 1978,
        identity: "Anishinaabe",
        specificIdentity: "Chippewas of the Thames First Nation",
        image: "Jay_Soule.png",
        background: "Ontario.png",
        links: [
            { type: "website", url: "https://chippewar.com/" },
            { type: "x", url: "https://x.com/chippewar" },
            { type: "instagram", url: "https://www.instagram.com/chippewar/" }
        ],
        bio: "Originally a tattoo artist, his work has expanded into painting, illustration, murals, clothing, and installation. As a survivor of the Sixties Scoop, he channels his personal history to create complex visual narratives rooted in political resistance. He often works under his alter ego Chippewar. The name reflects the ongoing conflict as a result of Canada's unresolved cologial legacy.",
        works: [
            {
                title: "Built on Genocide",
                year: 2021,
                medium: "installation, mixed media",
                description: "The haunting installation features a pile of faux bison skulls. It references the mass extermination that came as a result of railway expansion. It ties colonial conquest to ecological terror. It visualizes the many layers of genocide faced by the land, people, and ecology.",
                impact: "Celebrated during Toronto's Luminato Festival, it caused urgent conversation on the colonial damage to indigenous land and livelihoods. It was praised for its emotional depth in its portrayal of conquest as ecological horror."
            },
            {
                title: "Seeing Red: Movie Posters Indigenized by CHIPPEWAR",
                year: 2013,
                medium: "Acrylic on wood prints & illustration",
                description: "The series plays on classic tropes by swapping indigenous figures in the place of colonial ones in iconic film posters. It flips the script on cultural erasure, wiping away colonial figures just as indigenous figures have been for generations.",
                impact: "The pieces were widely praised, causing dialogue over themes of indigenous sovereignty. Their power comes in the active and aggressive reclamation of Indigenous space. They poke fun while calling attention through contrast."
            },
            {
                title: "Precious Resource",
                year: 2020,
                medium: "Screenprint",
                description: "The work draws a connection between the industries of resource extraction, and the surge of violence against Indigenous women. The piece uses layered symbolism, the mask representative of identity and resistance, with the broken heart communicating trauma. The piece places economic interest as complic in the disappearances.",
                impact: "Through its striking imagery, the piece highlights the treatment of Indigenous bodies as resources. It frames the violence as the direct fault of government inaction. It draws force and power to the MMIW (murdered/missing Indigenous women and girls) movement. The piece became a collectors print as a result of its limited quantity."
            }
        ]
    },
    {
        id: "lance_cardinal",
        name: "Lance Cardinal",
        pronouns: "He/Him",
        birthYear: 1974,
        identity: "Cree",
        specificIdentity: "Bigstone Cree Nation",
        image: "Lance_Cardinal.png",
        background: "Alberta.png",
        links: [
            { type: "website", url: "https://www.lancecardinal.com/" },
            { type: "instagram", url: "https://www.instagram.com/lancecardinal75/" }
        ],
        bio: "Lance Cardinal is a Two-Spirit Cree artist, designer, and educator. His work has included theater sets, large scale murals, traditional crafts, and multimedia installations. He is known best for incorporating traditional Cree visual language with modern sensibilities. He aims to preserve and propagate his culture through his work. His mission is deeply rooted in cultural reclamation and intergenerational healing.",
        works: [
            {
                title: "The Spirit of Treaty",
                year: 2019,
                medium: "Acrylic mural on wall",
                description: "This project is a massive public mural that speaks to the Treaty 6 relationships, along with the importance of recognizing and honoring Indigenous presence on the land. The piece uses traditional symbols such as the eagle, tipi, and river. The work mixes these symbols along with urban design styles, representing the coexistence of Indigenous and Settler histories.",
                impact: "This mural has become a prominent symbol of Indigenous recognition in government space. It was a turning point in Edmonton's approach to reconciliation through public art. It educates non-Indigenous viewers while empowering Indigenous youth. It has been used in a variety of educational programming and reconciliation campaigns."
            },
            {
                title: "Spirit of the North",
                year: 2018,
                medium: "Large scale set design",
                description: "This set was commissioned for the opening ceremonies of the Arctic Winter Games, this piece used massive sculptural forms and lighting to reflect Northern Indigenous worldviews. He merged Cree symbology with northern imagery (caribou, northern lights, fire), to create an immersive experience. It emphasises cultural connection and the strength of uth.",
                impact: "This set was viewed by thousands of people both in person and online. It challenged the boundaries of expectation, shaping the way the world viewed Indigenous art. The project has since been referenced by design schools and Indigenous studies as a model for large scale design art."
            },
            {
                title: "Two-Spirit Pride Crosswalk",
                year: 2022,
                medium: "Painted asphalt crosswalk",
                description: "The piece is a public crosswalk celebrating Two-Spirit identities within the Queer and Indigenous communities. Cardinal uses Cree floral motifs along with the rainbow pride colours to celebrate marginalized and intersectional voices. As someone who identifies as Two-Spirit, the piece was intended to assert the historical and continued existence of Indigenous gender diversity.",
                impact: "This work was the first of its kind in Canada (Two-Spirit pride crosswalk), receiving it national attention. Given its permanent visibility, it served as a powerful reminder of the effects of colonial oppression. It has since inspired other public art initiatives, encouraging cities to celebrate intersectional diversity."
            }
        ]
    },
    {
        id: "shelly_niro",
        name: "Shelly Niro",
        pronouns: "She/Her",
        birthYear: 1954,
        identity: "Mohawk",
        specificIdentity: "Six Nations of the Grand River",
        image: "Shelly_Niro.png",
        background: "Ontario.png",
        links: [
            { type: "website", url: "https://shelleyniro.ca/" }
        ],
        bio: "Known for her photography, film, painting, and beadwork, Niro is celebrated for her humorous, poignant, and political works that explore identity and cultural continuity. Niro is a groundbreaking artist, one of the first Indigenous women to have received national recognition in contemporary art. She paved the way to future generations to thrive. Her work has contributed to the reclamation of Indigenous space in the cultural zeitgeist.",
        works: [
            {
                title: "The Shirt",
                year: 2003,
                medium: "Short film",
                description: "The Shirt is a powerful short film that juxtaposes commercial consumerism with brutal historical honesty. Her work uses deadpan humor to force the viewer into confronting and reflecting upon the injustices of Indigenous history. Her work highlights the tendency for Indigenous struggles to be trivialized or misunderstood in the modern world.",
                impact: "This short film has become a foundational work in Indigenous media arts. It has been featured frequently in academic settings for its focus on Indigenous sovereignty, gender, and colonialism. The balance of humor and emotion has made it a common place for discussions around cultural survival."
            },
            {
                title: "Time Travels Through Us",
                year: 2015,
                medium: "Mixed media installation, Photography",
                description: "Time Travels Through Us was created for the 2015 Pan Am Games in Toronto. It uses Mohawk stories of time, family, survival, and resistance. It centers on strong female figures across urban and futuristic environments. It centers on cultural continuity in the way that it plays with the expectations of time.",
                impact: "As a public facing work, it brought Indigenous resilience and futurism to a massive audience. It was praised for its mix of tradition and modernity, and for depicting women as powerful agents of change (rather than just as victims)."
            },
            {
                title: "Mohawks in Beehives",
                year: 1991,
                medium: "Photography",
                description: "This series of photos features Mohawk women dressed in 1960's style beehive wigs, and glamorous clothing. It plays with the expectations of 'authentic' expectations. It contrasts playful visuals with the context of assimilation and cultural genocide. Through this, the work questions how identity is shaped from without and within.",
                impact: "'Mohawks in Beehives' became iconic in Indigenous art history, especially for its role in the resurgence of Indigenous feminism and gender studies. This work was among the first to use visual irony as a tool for tackling representation and identity politics. It is now taught in art history and Indigenous studies courses."
            }
        ]
    },
    {
        id: "dana_claxton",
        name: "Dana Claxton",
        pronouns: "She/Her",
        birthYear: 1959,
        identity: "Lakota Sioux",
        specificIdentity: "Wood Mountain Lakota First Nation",
        image: "Dana_Claxton.png",
        background: "Saskatchewan.png",
        bio: "Dana Claxton is a leading visual artist and filmmaker. Her work spans photography, installation, and performance. Her work investigates the impact of colonialism on Indigenous bodies through media, consumerism, and historical erasure. She is known for visually stunning and symbolically rich works. Her project confronts the viewer with beauty, power, and tension. She is also a professor and Head of the Department of Art History, Visual Art and Theory at the University of British Columbia, where she mentors emerging Indigenous artists.",
        works: [
            {
                title: "Buffalo Bone China",
                year: 1997,
                medium: "Video installation",
                description: "This project explores the colonial destruction of the buffalo and its consequences on the Lakota people. It juxtaposes the industrial production of fine china (made from buffalo bone ash) with the mass slaughter of the buffalo. Her work condemns the commodification of the sacred animal, and highlights its destruction as a tool of economic oppression.",
                impact: "This work was one of the first Canadian art pieces to directly connect consumerism with ecological and cultural genocide. It has been referenced frequently in ecocriticism discussions. It has been shown internationally, helping to shape and shift how galleries viewed Indigenous works"
            },
            {
                title: "Headdress",
                year: 2018,
                medium: "Chromogenic prints on aluminum",
                description: "This series of portraits display contemporary Indigenous women wearing traditional Lakota-style headdresses in modern fashionable contexts. With direct gaze and elaborate style, the work aims to encourage the viewer to consider the evolution of Indigenous identity.",
                impact: "This series was a landmark moment for Indigenous women in contemporary Canadian art. The beauty of the images drew in a wide audience. Part of this audience were younger Indigenous viewers who were given the chance to see their cultures reflected in a new modern light."
            },
            {
                title: "Rattle",
                year: 2003,
                medium: "Video performance",
                description: "This video serves as a digital ceremony, an act of spiritual reclamation and healing. The video documents and immortalizes the rattle. The rattle itself is a sacred Lakota instrument used to call upon spirits and restore balance. By placing this practice in the digital world, she implies that ceremony still holds power in the modern day, that it still changes and adapts with the times.",
                impact: "Though smaller than many of her other works (in terms of reach and popularity), this video had a profound impact on Indigenous art and digital media circles. It is not screen and academic context, having inspired conversation about the role of technology in preserving ceremony."
            }
        ]
    },
    {
        id: "kablusiak",
        name: "Kablusiak",
        pronouns: "They/Them",
        birthYear: 1993,
        identity: "Inuvialuk",
        specificIdentity: "Tuktoyaktuk/Northwest Territories",
        image: "Kablusiak.png",
        background: "Northwest_Territories.png",
        links: [
            { type: "instagram", url: "https://www.instagram.com/kablusiak/" },
            { type: "inuitartfoundation", url: "https://www.inuitartfoundation.org/profiles/artist/Kablusiak" }
        ],
        bio: "An interdisciplinary artist and curator, their work spreads across installation, performance, photography, textiles, and digital art. Their work blends humor, vulnerability, and critical commentary on colonialism and identity. She often uses ghost imagery, Inuit iconography, and domestic objects to explore the disconnect in identity caused by colonialism.",
        works: [
            {
                title: "Ugly cry",
                year: 2019,
                medium: "Performance",
                description: "The ghostly figure depicted in this work embraces absurdity as a vessel for exploring emotion suppression and intergenerational trauma. The performance is intimate and uncomfortable, forcing audiences to witness what is normally unseen.",
                impact: "This project was a defining moment in Kablusiak's career for its contribution to performance art. It provided a radically honest and raw interpretation of grief, contrasting the stoic/noble warrior stereotype."
            }
        ]
    },
    {
        id: "caroline_monnet",
        name: "Caroline Monnet",
        pronouns: "She/Her",
        birthYear: 1985,
        identity: "Anishinaabe/French",
        specificIdentity: "Outaouais region",
        image: "Caroline_Monnet.png",
        background: "Quebec.png",
        links: [
            { type: "website", url: "https://www.carolinemonnet.ca/" },
            { type: "instagram", url: "https://www.instagram.com/caromonnet/" },
            { type: "nfb", url: "https://www.nfb.ca/directors/caroline-monnet/" }
        ],
        bio: "Caroline Monnet is an artist and filmmaker whose work explores indigenous identity, colorial structure, and cultural hybridity. She brings a unique multicultural perspective to her work. She has worked in mediums such as film, sculpture, installation, and digital media.",
        works: [
            {
                title: "Proximal I",
                year: 2018,
                medium: "Sculpture",
                description: "This project is a large-scale sculpture that features stacked concrete blocks engraved with geometric patterns that were derived from Anishinaabe visual language. The traditional themes of land, family, and community clash with the industrial material. The piece highlights the way that Indigenous people were pushed away by industrialization.",
                impact: "'Proximal I' has become a key piece in dialogues about Indigenous modernism and land-based abstraction. It challenges viewers to recognize Indigenous design as dynamic and contemporary rather than fossilized in the past."
            },
            {
                title: "Mobilize",
                year: 2015,
                medium: "Experimental short film",
                description: "The film captures Indigenous people navigating both traditional and urban environments. The film highlights the adaptability and energy of Indigenous communities. He reframes the displacement of community, portraying the people as strong and flexible, rather than simple victims.",
                impact: "This film is acclaimed and celebrated as one of Monnet's best and most accessible works. The transformation of colonial footage into a celebration of resilience resists the static, analytical view placed on Indigenous peoples in archival media"
            }
        ]
    },
    {
        id: "tanya_tagaq",
        name: "Tanya Tagaq",
        pronouns: "She/Her",
        birthYear: 1975,
        identity: "Inuk",
        specificIdentity: "Nunavut",
        image: "Tanya_Tagaq.png",
        background: "Nunavut.png",
        links: [
            { type: "website", url: "https://www.tanyatagaq.com/" },
            { type: "instagram", url: "https://www.instagram.com/tanyatagaq/" },
            { type: "x", url: "https://x.com/tagaq" }
        ],
        bio: "Tanya Tagaq an internationally acclaimed Inuk throat singer, composer, and visual artist. Her unique vocal style breaks genres, blending traditional throat singing with punk, industrial, and experimental influences. It collects to form an intense and emotional musical experience. In youth she was separated from her culture by the Canadian education system, she would later reclaim it through the fierce originality of her performances.",
        works: [
            {
                title: "Fracking",
                year: 2014,
                medium: "Song",
                description: "Fracking is one of Tanya Tagaq's most politically charged and haunting pieces. The song was featured on her Prize-winning album Animism. It was written to mimic the sounds of fracking through its powerful vocal deliveries.",
                impact: "This song positioned the artist not just as an experimental artist, but as an environmental activist. This song has been performed at climate summits, art biennales, and activist events."
            },
            {
                title: "Retribution",
                year: 2016,
                medium: "Song",
                description: "Retribution is the title track of Tanya Tagaq's 2016 album, serving as an indictment of colonial violence. The track's structure mirrors cycles of trauma and resistance. It builds, breaks, and resurges, refusing to be silenced",
                impact: "Retribution has served as an anthem for decolonial resistance in musical and academics circles, it has been embraced by feminist and Indigenous movements across North America."
            }
        ]
    },
    {
        id: "rande_cook",
        name: "Rande Cook",
        pronouns: "He/Him",
        birthYear: 1977,
        identity: "Kwakwaka'wakw",
        specificIdentity: "'Namgis First Nation",
        image: "Rande_Cook.png",
        background: "British_Colombia.png",
        links: [
            { type: "website", url: "https://www.randecook.gallery/" },
            { type: "instagram", url: "https://www.instagram.com/rande_cook/" }
        ],
        bio: "Rande Cook is a multidisciplinary artist and hereditary chief from the 'Namgis First Nation. Cook grew up surrounded by rich cultural practices and was formally trained by master carvers in the traditional Northwest Coast art forms. He uses his art to assert Indigenous sovereignty, protect ancestral knowledge, and fight against the commodification of Indigenous Identity.",
        works: [
            {
                title: "Resurgence",
                year: 2018,
                medium: "Sculpture",
                description: "Resurgence is an immersive installation celebrating cultural renewal through motion and sound. The salmon and the raven represent motifs of transformation and resistance (central to Kwakwaka'wakw cosmology). It incorporates audio of drumming and spoken Kwak'wala language.",
                impact: "This piece received critical acclaim for its fusion of traditional carving with multimedia storytelling. It repositioned Indigenous art as not just a thing to look at, but as an experience to feel and hear. The piece traveled to several venues after premiering at the Legacy Art Gallery in Victoria."
            }
        ]
    },
    {
        id: "jordan_bennett",
        name: "Jordan Bennett",
        pronouns: "He/Him",
        birthYear: 1986,
        identity: "Mi'kmaq",
        specificIdentity: "Qalipu First Nation, Newfoundland",
        image: "Jordan_Bennett.png",
        background: "Newfoundland.png",
        links: [
            { type: "website", url: "https://www.jordanbennett.ca/" }
        ],
        bio: "A multidisciplinary artist from Nova Scotia, Jordan Bennet works across painting, installation, video, sound, performance, and tattoo artwork. With a Bachelors and Masters in Fine Arts, his work has deeply explored themes of land, language, family history, and Beothuk–Mi'kmaq visual heritage.",
        works: [
            {
                title: "13 Moons: Full Suite",
                year: 2020,
                medium: "Giclée prints on rag paper",
                description: "This work embeds seasonal knowledge, ceremonial timing, and ecological rhythms into contemporary art. Bennett revives ancestral concepts by bringing them into a minimalist modernist visual language.",
                impact: "This series reclaims cultural knowledge through its presentation as fine art. It has been purchased by institutions such as the Portland Museum of Art. 13 Moons invites audiences to connect with Indigenous temporal frameworks."
            }
        ]
    }
]; 